import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { TotalStock } from "@/src/models/totalStockModel";
import { Products } from "@/src/models/ProductModel";

const DAYS_WINDOW = 30;

type Severity = "LOW" | "MEDIUM" | "CRITICAL" | "OK";

/* 🧠 Severity logic (single source of truth) */
type SeverityResult = {
  severity: Severity;
  reason: string;
  daysLeft: number | null;
};

function evaluateSeverity(
  qty: number,
  avgDailySales: number,
  cfg: {
    minQty: number;
    warningQty: number;
    criticalDays: number;
    warningDays: number;
    lowDays: number;
  }
): SeverityResult {
  // 🔴 HARD QUANTITY RULES (always apply)
  if (qty <= cfg.minQty) {
    return {
      severity: "CRITICAL",
      reason: `Stock below minimum threshold (${cfg.minQty})`,
      daysLeft: null,
    };
  }

  if (qty <= cfg.warningQty && avgDailySales > 0) {
    const daysLeft = qty / avgDailySales;
    return {
      severity: "MEDIUM",
      reason: `Low stock (${qty}), ~${daysLeft.toFixed(1)} days left`,
      daysLeft: Number(daysLeft.toFixed(1)),
    };
  }


  // 📉 VELOCITY-BASED RULES
  if (avgDailySales > 0) {
    const daysLeft = qty / avgDailySales;

    if (daysLeft <= cfg.criticalDays) {
      return {
        severity: "CRITICAL",
        reason: `Only ${daysLeft.toFixed(1)} days of stock left`,
        daysLeft: Number(daysLeft.toFixed(1)),
      };
    }

    if (daysLeft <= cfg.warningDays) {
      return {
        severity: "MEDIUM",
        reason: `Stock will run out in ~${daysLeft.toFixed(1)} days`,
        daysLeft: Number(daysLeft.toFixed(1)),
      };
    }

    if (daysLeft <= cfg.lowDays) {
      return {
        severity: "LOW",
        reason: `Monitor stock, ${daysLeft.toFixed(1)} days remaining`,
        daysLeft: Number(daysLeft.toFixed(1)),
      };
    }

    return {
      severity: "OK",
      reason: `Healthy stock for ~${daysLeft.toFixed(1)} days`,
      daysLeft: Number(daysLeft.toFixed(1)),
    };
  }

  // 💤 NO SALES FALLBACK
  return {
    severity: "OK",
    reason: "No recent sales and stock above minimum threshold",
    daysLeft: null,
  };
}


export async function GET(req: NextRequest) {
  await connect();

  const email = req.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  /* 📅 Last 30 days */
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - DAYS_WINDOW);

  /* 1️⃣ Current stock */
  const stock = await TotalStock.find({ email }).lean();
  const products = await Products.find({ email }).lean();

  const productMap = new Map(
    products.map(p => [`${p.name}|${p.unit}`, p])
  );


  /* 2️⃣ Sales in last 30 days */
  const sales = await LedgerEntry.find(
    {
      email,
      voucherType: "Sale",
      isReversal: false,
      date: { $gte: fromDate },
    },
    { itemName: 1, unit: 1, creditQty: 1 }
  ).lean();

  /* 3️⃣ Build sales map */
  const salesMap = new Map<string, number>();

  for (const s of sales) {
    const key = `${s.itemName}|${s.unit}`;
    salesMap.set(key, (salesMap.get(key) || 0) + (s.creditQty || 0));
  }

  /* 4️⃣ Build alerts */
  const alerts: any[] = [];
  const explanations: any[] = [];

  for (const s of stock) {
    const key = `${s.name}|${s.unit}`;
    const qty = s.quantity;
    if (qty <= 0) continue;

    const soldQty = salesMap.get(key) || 0;
    const avgDailySales = soldQty / DAYS_WINDOW;

    const product = productMap.get(key);

    const cfg = product?.lowStockConfig ?? {
      minQty: 5,
      warningQty: 10,
      criticalDays: 3,
      warningDays: 7,
      lowDays: 14,
    };

    const result = evaluateSeverity(qty, avgDailySales, cfg);

    if (result.severity === "OK") {
      explanations.push({
        product: s.name,
        unit: s.unit,
        message: result.reason,
        quantity: qty,
        avgDailySales: Number(avgDailySales.toFixed(2)),
        daysLeft: result.daysLeft,
      });
      continue;
    }

    alerts.push({
      product: s.name,
      unit: s.unit,
      quantity: qty,
      avgDailySales: Number(avgDailySales.toFixed(2)),
      daysLeft: result.daysLeft,
      severity: result.severity,
      reason: result.reason,
    });
  }


  // console.log(sales);
  // console.log(stock);
  // console.log(salesMap);
  // console.log(alerts)

  return NextResponse.json({
    alerts: {
      count: alerts.length,
      products: alerts,
    },
    noAlerts: explanations, // 👈 UI gold
  });

}

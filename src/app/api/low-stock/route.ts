import { NextRequest, NextResponse } from "next/server";
import connect from "@/src/dbConfig/dbConnection";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import { Products } from "@/src/models/ProductModel";
import { calculateCompositeStock } from "@/src/utils/compositeStock";

const DAYS_WINDOW = 30;

type Severity = "LOW" | "MEDIUM" | "CRITICAL" | "OK";

/* 🧠 Severity logic (single source of truth) */
type SeverityResult = {
  severity: Severity;
  reason: string;
  daysLeft: number | null;
  status: string;
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
  let daysLeft: number | null = null;

  if (avgDailySales > 0) {
    daysLeft = Number((qty / avgDailySales).toFixed(1));
  }

  // 🔴 HARD QUANTITY RULES (always apply)
  if (qty <= cfg.minQty) {
    return {
      severity: "CRITICAL",
      reason: daysLeft !== null
        ? `Stock critical (${qty}), ~${daysLeft} days left`
        : `Stock below minimum threshold (${cfg.minQty})`,
      daysLeft,
      status: "Below Minimum",
    };
  }

  if (qty <= cfg.warningQty) {
    return {
      severity: "MEDIUM",
      reason: daysLeft !== null
        ? `Low stock (${qty}), ~${daysLeft} days left`
        : `Low stock (${qty}), refill suggested`,
      daysLeft,
      status: "Low Stock",
    };
  }


  // 📉 VELOCITY-BASED RULES
  if (daysLeft !== null) {
    if (daysLeft <= cfg.criticalDays) {
      return {
        severity: "CRITICAL",
        reason: `Only ${daysLeft} days of stock left`,
        daysLeft,
        status: "High Movement",
      };
    }

    if (daysLeft <= cfg.warningDays) {
      return {
        severity: "MEDIUM",
        reason: `Stock will run out in ~${daysLeft} days`,
        daysLeft,
        status: "Refill Soon",
      };
    }

    if (daysLeft <= cfg.lowDays) {
      return {
        severity: "LOW",
        reason: `Monitor stock, ${daysLeft} days remaining`,
        daysLeft,
        status: "Monitor",
      };
    }

    return {
      severity: "OK",
      reason: `Healthy stock for ~${daysLeft} days`,
      daysLeft,
      status: "Healthy",
    };
  }

  // 💤 NO SALES FALLBACK
  return {
    severity: "OK",
    reason: "No recent sales and stock above minimum threshold",
    daysLeft: null,
    status: "Healthy",
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

  /* 1️⃣ Current stock (Using Products model now) */
  const products = await Products.find({ email }).lean();

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

  for (const p of products) {
    const key = `${p.name}|${p.unit}`;

    // Compute quantity correctly for composite products
    const qty =
      p.productType === "composite"
        ? await calculateCompositeStock(p, null)
        : p.quantity;

    if (qty <= 0 && p.productType !== "composite") {
      // Evaluate 0 stock items immediately as critical if they are simple products
      alerts.push({
        product: p.name,
        unit: p.unit,
        quantity: 0,
        avgDailySales: 0,
        daysLeft: 0,
        severity: "CRITICAL",
        reason: "Out of stock",
        status: "Out of Stock",
      });
      continue;
    }


    const soldQty = salesMap.get(key) || 0;
    const avgDailySales = soldQty / DAYS_WINDOW;

    // Default config fallback
    const defaults = {
      minQty: 5,
      warningQty: 10,
      criticalDays: 3,
      warningDays: 7,
      lowDays: 14,
    };

    const cfg = { ...defaults, ...(p.lowStockConfig || {}) };

    const result = evaluateSeverity(qty, avgDailySales, cfg);

    if (result.severity === "OK") {
      explanations.push({
        product: p.name,
        unit: p.unit,
        message: result.reason,
        quantity: qty,
        avgDailySales: Number(avgDailySales.toFixed(2)),
        daysLeft: result.daysLeft,
        status: result.status,
      });
      continue;
    }

    alerts.push({
      product: p.name,
      unit: p.unit,
      quantity: qty,
      avgDailySales: Number(avgDailySales.toFixed(2)),
      daysLeft: result.daysLeft,
      severity: result.severity,
      reason: result.reason,
      status: result.status,
    });
  }

  return NextResponse.json({
    alerts: {
      count: alerts.length,
      products: alerts,
    },
    noAlerts: explanations,
  });

}

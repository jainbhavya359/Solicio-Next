import { NextRequest, NextResponse } from "next/server";
import { LedgerEntry } from "@/src/models/LedgerEntryModel";
import Stock from "@/src/models/stockModel";
import connect from "@/src/dbConfig/dbConnection";

function generateSalesForecast(
  timeline: { date: string; sales: number }[],
  horizonDays = 7
) {
  const recent = timeline.slice(-7);

  if (recent.length === 0) {
    return {
      method: "moving_average",
      horizonDays,
      confidence: "low",
      daily: [],
      summary: {
        expectedTotalSales: 0,
        expectedAvgDailySales: 0,
      },
    };
  }

  const weights = recent.map((_, i) => i + 1);
  const weightSum = weights.reduce((a, b) => a + b, 0);

  const weightedAvg =
    recent.reduce(
      (sum, d, i) => sum + d.sales * weights[i],
      0
    ) / weightSum;

  const dailyForecast = [];
  let forecastDate = new Date(
    timeline[timeline.length - 1].date
  );

  for (let i = 0; i < horizonDays; i++) {
    forecastDate.setDate(forecastDate.getDate() + 1);

    dailyForecast.push({
      date: forecastDate.toISOString().slice(0, 10),
      predictedSales: Number(weightedAvg.toFixed(2)),
    });
  }

  return {
    method: "weighted_moving_average",
    horizonDays,
    confidence:
      recent.length >= 7 ? "medium" : "low",
    daily: dailyForecast,
    summary: {
      expectedTotalSales: Number(
        (weightedAvg * horizonDays).toFixed(2)
      ),
      expectedAvgDailySales: Number(
        weightedAvg.toFixed(2)
      ),
    },
  };
}


export async function GET(req: NextRequest) {
  try {
    await connect();
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const days = Number(searchParams.get("days") ?? 30);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    /* ---------------- DATE RANGE ---------------- */
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    /* ---------------- DAILY SALES AGGREGATION ---------------- */
    const rawDaily = await LedgerEntry.aggregate([
      {
        $match: {
          email,
          isReversal: false,
          voucherType: { $in: ["Sale", "SaleReturn"] },
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$date",
              },
            },
          },
          sales: {
            $sum: {
              $cond: [
                { $eq: ["$voucherType", "Sale"] },
                "$amount",
                { $multiply: ["$amount", -1] },
              ],
            },
          },
          qty: {
            $sum: {
              $cond: [
                { $eq: ["$voucherType", "Sale"] },
                "$creditQty",
                { $multiply: ["$debitQty", -1] },
              ],
            },
          },
          cost: { $sum: "$costAmount" },
        },
      },
      {
        $addFields: {
          profit: { $subtract: ["$sales", "$cost"] },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    /* ---------------- ZERO-FILL TIMELINE ---------------- */
    const timeline: {
      date: string;
      sales: number;
      qty: number;
      profit: number;
    }[] = [];

    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      const day = cursor.toISOString().slice(0, 10);
      const found = rawDaily.find(d => d._id.day === day);

      timeline.push({
        date: day,
        sales: found?.sales ?? 0,
        qty: found?.qty ?? 0,
        profit: found?.profit ?? 0,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    const forecast = generateSalesForecast(
        timeline.map(d => ({ date: d.date, sales: d.sales })),
        7 // forecast days
    );


    /* ---------------- SUMMARY ---------------- */
    const totalSales = timeline.reduce((s, d) => s + d.sales, 0);
    const totalQty = timeline.reduce((s, d) => s + d.qty, 0);
    const totalProfit = timeline.reduce((s, d) => s + d.profit, 0);

    const avgDailySales = totalSales / days;

    /* ---------------- GROWTH ---------------- */
    const mid = Math.floor(timeline.length / 2);
    const firstHalfSales = timeline
      .slice(0, mid)
      .reduce((s, d) => s + d.sales, 0);

    const secondHalfSales = timeline
      .slice(mid)
      .reduce((s, d) => s + d.sales, 0);

    const growthPct =
      firstHalfSales > 0
        ? ((secondHalfSales - firstHalfSales) /
            firstHalfSales) *
          100
        : secondHalfSales > 0
        ? 100
        : 0;

    /* ---------------- CONSISTENCY ---------------- */
    const salesValues = timeline.map(d => d.sales);
    const avg = avgDailySales;

    const variance =
      salesValues.reduce(
        (s, v) => s + Math.pow(v - avg, 2),
        0
      ) / salesValues.length;

    const stdDev = Math.sqrt(variance);
    const volatilityRatio = avg > 0 ? stdDev / avg : 0;

    /* ---------------- PROFITABILITY ---------------- */
    const grossMargin =
      totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

    const profitPerUnit =
      totalQty > 0 ? totalProfit / totalQty : 0;

    /* ---------------- INVENTORY IMPACT ---------------- */
    const stock = await Stock.find({ email }).lean();

    const stockValue = stock.reduce(
      (s, i) => s + i.quantity * i.price,
      0
    );

    const inventoryToSalesDays =
      avgDailySales > 0 ? stockValue / avgDailySales : 0;

    /* ---------------- PRODUCT SIGNALS ---------------- */
    const topProducts = await LedgerEntry.aggregate([
      {
        $match: {
          email,
          voucherType: "Sale",
          isReversal: false,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$itemName",
          sales: { $sum: "$amount" },
          qty: { $sum: "$creditQty" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
    ]);

    /* ---------------- RISKS ---------------- */
    const risks: string[] = [];

    const topShare =
      topProducts.length > 0
        ? topProducts[0].sales / totalSales
        : 0;

    if (grossMargin < 8) risks.push("Low profit margin");
    if (volatilityRatio > 0.9)
      risks.push("Highly volatile sales");
    if (inventoryToSalesDays > 60)
      risks.push("Excess inventory");
    if (topShare > 0.4)
      risks.push("Revenue depends on one product");

    /* ---------------- SCORE ---------------- */
    let score = 0;

    if (growthPct > 10) score += 25;
    else if (growthPct > 0) score += 18;

    if (grossMargin > 25) score += 25;
    else if (grossMargin > 10) score += 18;

    if (volatilityRatio < 0.5) score += 20;
    else if (volatilityRatio < 0.8) score += 12;

    if (inventoryToSalesDays < 30) score += 20;
    else if (inventoryToSalesDays < 60) score += 10;

    /* ---------------- RESPONSE ---------------- */
    return NextResponse.json({
      meta: {
        rangeDays: days,
        generatedAt: new Date(),
      },
      timeline,
      forecast,
      summary: {
        totalSales,
        totalQty,
        totalProfit,
        avgDailySales,
      },
      growth: {
        percentage: Number(growthPct.toFixed(2)),
        direction:
          growthPct > 0
            ? "up"
            : growthPct < 0
            ? "down"
            : "flat",
      },
      profitability: {
        grossMargin: Number(grossMargin.toFixed(2)),
        profitPerUnit: Number(profitPerUnit.toFixed(2)),
      },
      consistency: {
        volatilityRatio: Number(volatilityRatio.toFixed(2)),
      },
      inventoryImpact: {
        stockValue,
        inventoryToSalesDays: Number(
          inventoryToSalesDays.toFixed(1)
        ),
      },
      productSignals: topProducts,
      risks,
      score,
    });
  } catch (error) {
    console.error("Sales Trend API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

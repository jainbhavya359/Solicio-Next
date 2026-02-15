"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ------------------ BASE CARD ------------------ */
function Card({ children, className = "", delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
      whileHover={{ y: -2 }}
      className={`relative rounded-3xl bg-white p-6 shadow-sm hover:shadow-md transition-all ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ------------------ COUNT UP ------------------ */
function useCountUp(value: number, duration = 700) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const inc = value / (duration / 16);

    const t = setInterval(() => {
      start += inc;
      if (start >= value) {
        setDisplay(value);
        clearInterval(t);
      } else {
        setDisplay(Math.round(start));
      }
    }, 16);

    return () => clearInterval(t);
  }, [value, duration]);

  return display;
}

/* ------------------ SALES HEALTH CARDS ------------------ */
export function SalesHealthCards({ data }: { data: any }) {
  const totalSales = useCountUp(data.summary.totalSales);
  const avgDaily = useCountUp(data.summary.avgDailySales);
  const score = useCountUp(data.score);

  const formattedAvg = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(avgDaily);

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      <Card delay={0.05}>
        <p className="text-sm text-slate-500">Total Sales</p>
        <p className="mt-1 text-3xl font-semibold">₹{totalSales}</p>
        <p className="text-xs text-slate-400">Avg/day {formattedAvg}</p>
      </Card>


      <Card delay={0.1}>
        <p className="text-sm text-slate-500">Growth</p>
        <p
          className={`mt-1 text-3xl font-semibold ${
            data.growth.percentage >= 0
              ? "text-emerald-600"
              : "text-red-600"
          }`}
        >
          {data.growth.percentage}%
        </p>
        <p className="text-xs text-slate-400">Period momentum</p>
      </Card>

      <Card delay={0.15}>
        <p className="text-sm text-slate-500">Gross Margin</p>
        <p className="mt-1 text-3xl font-semibold">
          {data.profitability.grossMargin}%
        </p>
        <p className="text-xs text-slate-400">
          ₹{data.profitability.profitPerUnit.toFixed(2)} / unit
        </p>
      </Card>

      <Card delay={0.2}>
        <p className="text-sm text-slate-500">Inventory Cover</p>
        <p className="mt-1 text-3xl font-semibold">
          {data.inventoryImpact.inventoryToSalesDays} days
        </p>
        <p className="text-xs text-slate-400">
          Stock ₹{data.inventoryImpact.stockValue}
        </p>
      </Card>

      <Card delay={0.25}>
        <p className="text-sm text-slate-500">Sales Volatility</p>
        <p className="mt-1 text-3xl font-semibold">
          {data.consistency.volatilityRatio}
        </p>
        <p className="text-xs text-slate-400">Lower is healthier</p>
      </Card>

      <Card delay={0.3}>
        <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          Business Health
        </span>
        <p
          className={`mt-3 text-4xl font-bold ${
            score >= 75
              ? "text-emerald-600"
              : score >= 50
              ? "text-amber-600"
              : "text-red-600"
          }`}
        >
          {score}/100
        </p>
        <p className="text-xs text-slate-400">Overall score</p>
      </Card>

      {data.risks.length > 0 && (
        <Card delay={0.35} className="bg-red-50">
          <p className="text-sm font-semibold text-red-600">Risks</p>
          <ul className="mt-2 space-y-1 text-sm text-red-600">
            {data.risks.map((r: string, i: number) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

/* ------------------ SALES TREND ------------------ */
export function SalesTrendGraphCard({ data }: { data: any }) {
  const chartData = data.timeline.map((d: any) => ({
    date: d.date.slice(5),
    sales: d.sales,
  }));

  const forecast = (data.forecast?.daily ?? []).map((d: any) => ({
    date: d.date.slice(5),
    forecast: d.predictedSales,
  }));

  return (
    <Card delay={0.1}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sales Trend</h3>
        <span className="text-xs text-slate-400">Actual vs forecast</span>
      </div>

      <div className="h-[320px] rounded-2xl bg-slate-50 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[...chartData, ...forecast]}>
            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="2 4"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                fontSize: 12,
              }}
            />

            {/* ACTUAL */}
            <Line
              dataKey="sales"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />

            {/* FORECAST */}
            <Line
              dataKey="forecast"
              stroke="#64748b"
              strokeWidth={2}
              strokeDasharray="6 6"
              dot={false}
              opacity={0.6}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

/* ------------------ FORECAST SUMMARY ------------------ */
export function ForecastSummaryCard({ data }: { data: any }) {
  const total = useCountUp(data.forecast.summary.expectedTotalSales);
  const avg = useCountUp(data.forecast.summary.expectedAvgDailySales);

  return (
    <Card
      delay={0.15}
      className="bg-gradient-to-br from-emerald-50 via-white to-white"
    >
      <p className="text-sm font-medium text-emerald-700">
        Next {data.forecast.horizonDays} days
      </p>
      <p className="mt-2 text-4xl font-bold">₹{total}</p>
      <p className="text-sm text-slate-500">Avg/day ₹{avg}</p>

      <span className="mt-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
        Confidence: {data.forecast.confidence}
      </span>
    </Card>
  );
}

/* ------------------ TOP PRODUCT DONUT ------------------ */
const COLORS = ["#16a34a", "#2563eb", "#f59e0b", "#ef4444", "#8b5cf6"];

export function TopProductDonut({ data }: { data: any }) {
  if (!data.productSignals?.length) return null;

  return (
    <Card>
      <p className="text-sm font-medium text-slate-600 mb-1">
        Top product contribution this week
      </p>
      <p className="text-xs text-slate-400 mb-4">
        Share of total sales
      </p>

      <div className="grid grid-cols-2 items-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data.productSignals}
              dataKey="sales"
              innerRadius={65}
              outerRadius={90}
            >
              {data.productSignals.map((_: any, i: number) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <ul className="space-y-2 text-sm">
          {data.productSignals.slice(0, 3).map((p: any, i: number) => (
            <li key={i} className="flex justify-between">
              <span className="text-slate-600">{p._id}</span>
              <span className="font-medium">{p.sales}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/* ------------------ ACTION SUGGESTIONS ------------------ */
export function ActionSuggestionCard({ data }: { data: any }) {
  const actions: string[] = [];

  if (data.consistency.volatilityRatio > 0.9)
    actions.push("Sales are volatile – plan purchases carefully");

  if (data.inventoryImpact.inventoryToSalesDays > 60)
    actions.push("Reduce inventory to free working capital");

  if (data.profitability.grossMargin < 8)
    actions.push("Review pricing or supplier costs");

  if (!actions.length)
    actions.push("Business looks healthy – continue current strategy");

  return (
    <Card
      delay={0.25}
      className="bg-gradient-to-br from-amber-50 via-white to-white"
    >
      <p className="mb-4 text-sm font-semibold text-amber-800">
        What should I do next?
      </p>

      <ul className="space-y-3 text-sm">
        {actions.map((a, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3"
          >
            <span className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
            {a}
          </motion.li>
        ))}
      </ul>
    </Card>
  );
}

/* ------------------ MARGIN TREND ------------------ */
export function MarginTrendGraph({ data }: { data: any }) {
  const chartData = data.timeline.map((d: any) => ({
    date: d.date.slice(5),
    margin: d.sales > 0 ? (d.profit / d.sales) * 100 : 0,
  }));

  return (
    <Card delay={0.3}>
      <p className="mb-3 text-sm text-slate-500">Margin trend (%)</p>

      <div className="h-[260px] rounded-2xl bg-slate-50 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis unit="%" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              dataKey="margin"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

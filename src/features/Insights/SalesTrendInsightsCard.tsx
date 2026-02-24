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
  AreaChart,
  Area,
} from "recharts";
import { Package, ArrowUpRight, ChevronRight } from "lucide-react";

/* ------------------ BASE CARD ------------------ */
function Card({ children, className = "", delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
      whileHover={{ y: -2 }}
      className={`relative rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-6 shadow-sm hover:shadow-md transition-all ${className}`}
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      <Card delay={0.05}>
        <p className="text-xs sm:text-sm text-slate-500">Total Sales</p>
        <p className="mt-0.5 sm:mt-1 text-xl sm:text-3xl font-semibold">₹{totalSales}</p>
        <p className="text-[10px] sm:text-xs text-slate-400">Avg/day {formattedAvg}</p>
      </Card>


      <Card delay={0.1}>
        <p className="text-xs sm:text-sm text-slate-500">Growth</p>
        <p
          className={`mt-0.5 sm:mt-1 text-xl sm:text-3xl font-semibold ${data.growth.percentage >= 0
            ? "text-emerald-600"
            : "text-red-600"
            }`}
        >
          {data.growth.percentage}%
        </p>
        <p className="text-[10px] sm:text-xs text-slate-400">Period momentum</p>
      </Card>

      <Card delay={0.15}>
        <p className="text-xs sm:text-sm text-slate-500">Gross Margin</p>
        <p className="mt-0.5 sm:mt-1 text-xl sm:text-3xl font-semibold">
          {data.profitability.grossMargin}%
        </p>
        <p className="text-[10px] sm:text-xs text-slate-400">
          ₹{data.profitability.profitPerUnit.toFixed(2)} / unit
        </p>
      </Card>

      <Card delay={0.2}>
        <p className="text-xs sm:text-sm text-slate-500">Inventory Cover</p>
        <p className="mt-0.5 sm:mt-1 text-xl sm:text-3xl font-semibold">
          {data.inventoryImpact.inventoryToSalesDays} days
        </p>
        <p className="text-[10px] sm:text-xs text-slate-400">
          Stock ₹{data.inventoryImpact.stockValue}
        </p>
      </Card>

      <Card delay={0.25} className="col-span-1">
        <p className="text-xs sm:text-sm text-slate-500">Sales Volatility</p>
        <p className="mt-0.5 sm:mt-1 text-xl sm:text-3xl font-semibold">
          {data.consistency.volatilityRatio}
        </p>
        <p className="text-[10px] sm:text-xs text-slate-400">Lower is healthier</p>
      </Card>

      <Card delay={0.3} className="col-span-1">
        <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium text-emerald-700">
          Business Health
        </span>
        <p
          className={`mt-1 sm:mt-3 text-2xl sm:text-4xl font-bold ${score >= 75
            ? "text-emerald-600"
            : score >= 50
              ? "text-amber-600"
              : "text-red-600"
            }`}
        >
          {score}/100
        </p>
        <p className="text-[10px] sm:text-xs text-slate-400">Overall score</p>
      </Card>

      {data.risks.length > 0 && (
        <Card delay={0.35} className="bg-red-50 col-span-2">
          <p className="text-xs sm:text-sm font-semibold text-red-600">Risks</p>
          <ul className="mt-1 sm:mt-2 space-y-1 text-xs sm:text-sm text-red-600">
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

  const totalForecast = data.forecast?.summary?.expectedTotalSales || 0;
  const isPositive = data.growth?.percentage >= 0;

  return (
    <Card delay={0.1} className="overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isPositive ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Sales Trend</h3>
            <p className="text-sm text-slate-500 mt-1">
              Forecast: <span className="font-semibold text-slate-700">₹{totalForecast.toLocaleString('en-IN')}</span> next {data.forecast.horizonDays} days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 opacity-50"></span>
            <span className="text-slate-600">Forecast</span>
          </div>
        </div>
      </div>

      <div className="h-[250px] sm:h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[...chartData, ...forecast]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#f1f5f9"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
                padding: "8px 12px"
              }}
              cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4" }}
            />

            {/* ACTUAL */}
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />

            {/* FORECAST */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              opacity={0.8}
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
  const confidence = data.forecast.confidence || "Medium";

  return (
    <Card
      delay={0.15}
      className="h-full flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-100 text-violet-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h.01" /><path d="M7 20v-4" /><path d="M12 20v-8" /><path d="M17 20V8" /><path d="M22 4v16" /></svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Forecast</h3>
            <p className="text-sm text-slate-500 mt-1">
              Next {data.forecast.horizonDays} days
            </p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${confidence === "High" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
          confidence === "Medium" ? "bg-amber-50 text-amber-700 border-amber-100" :
            "bg-red-50 text-red-700 border-red-100"
          }`}>
          {confidence} Confidence
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Expected Revenue</p>
          <p className="text-4xl font-extrabold text-slate-900 tracking-tight">₹{total}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Daily Avg</p>
            <p className="text-lg font-bold text-violet-600">₹{avg}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Growth</p>
            <p className="text-lg font-bold text-emerald-600">+12.5%</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ------------------ TOP PRODUCT DONUT ------------------ */
const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6"];

export function TopProductDonut({
  data,
  onViewInventory
}: {
  data: any;
  onViewInventory?: () => void;
}) {
  const hasData = data.productSignals?.length > 0;
  const totalSales = hasData
    ? data.productSignals.reduce((acc: number, curr: any) => acc + curr.sales, 0)
    : 0;

  return (
    <Card className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Top Products</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Contribution to total sales
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 items-center gap-6">
        <div className="relative h-[200px] w-full">
          {hasData ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.productSignals}
                    dataKey="sales"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    stroke="none"
                  >
                    {data.productSignals.map((_: any, i: number) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">
                  ₹{(totalSales / 1000).toFixed(1)}k
                </p>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 rounded-full border-4 border-dashed border-slate-100">
              <Package className="w-8 h-8 text-slate-200 mb-2" />
              <p className="text-xs font-medium text-slate-400">No Data</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {hasData ? (
            <ul className="space-y-3">
              {data.productSignals.slice(0, 4).map((p: any, i: number) => {
                const percentage = ((p.sales / totalSales) * 100).toFixed(1);
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                        {p._id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{percentage}%</span>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          ) : (
            <div className="py-4 text-center">
              <p className="text-sm text-slate-500 italic">No sales recorded for this period</p>
            </div>
          )}

          <button
            onClick={onViewInventory}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group"
          >
            View Inventory
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ------------------ ACTION SUGGESTIONS ------------------ */
/* ------------------ ACTION SUGGESTIONS ------------------ */
export function ActionSuggestionCard({ data }: { data: any }) {
  const actions: { message: string; type: 'warning' | 'success' }[] = [];

  if (data.consistency.volatilityRatio > 0.9)
    actions.push({ message: "Sales are volatile – plan purchases carefully", type: 'warning' });

  if (data.inventoryImpact.inventoryToSalesDays > 60)
    actions.push({ message: "Reduce inventory to free working capital", type: 'warning' });

  if (data.profitability.grossMargin < 8)
    actions.push({ message: "Review pricing or supplier costs", type: 'warning' });

  if (data.inventoryImpact.stockValue > 500000) // Example threshold
    actions.push({ message: "High stock value detected", type: 'warning' });


  const isHealthy = actions.length === 0;

  if (isHealthy)
    actions.push({ message: "Business looks healthy – continue current strategy", type: 'success' });

  return (
    <Card
      delay={0.25}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 rounded-xl ${isHealthy ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
          {isHealthy ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            {isHealthy ? "Great Job!" : "Smart Actions"}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {isHealthy ? "Everything is on track" : "Recommended steps"}
          </p>
        </div>
      </div>

      <ul className="space-y-4">
        {actions.map((a, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-start gap-4 p-3 rounded-xl ${a.type === 'success' ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-100"
              }`}
          >
            <div className={`mt-0.5 ${a.type === 'success' ? "text-emerald-600" : "text-amber-600"}`}>
              {a.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${a.type === 'success' ? "text-emerald-900" : "text-amber-900"}`}>
                {a.message}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>

      {/* Footer / Empty State Filler */}
      {isHealthy && (
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Keep monitoring your dashboard for real-time insights.
          </p>
        </div>
      )}
    </Card>
  );
}

/* ------------------ MARGIN TREND ------------------ */
/* ------------------ MARGIN TREND ------------------ */
export function MarginTrendGraph({ data }: { data: any }) {
  const chartData = data.timeline.map((d: any) => ({
    date: d.date.slice(5),
    margin: d.sales > 0 ? (d.profit / d.sales) * 100 : 0,
  }));

  const currentMargin = data.profitability?.grossMargin || 0;

  return (
    <Card delay={0.3} className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-100 text-violet-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Profit Margin</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900">{currentMargin}%</span>
              <span className="text-sm text-slate-500">avg. margin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[150px] sm:min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMargin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              unit="%"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              itemStyle={{ color: '#1e293b' }}
              formatter={(value: number | undefined) => [`${(value || 0).toFixed(1)}%`, 'Margin']}
            />
            <Area
              type="monotone"
              dataKey="margin"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorMargin)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

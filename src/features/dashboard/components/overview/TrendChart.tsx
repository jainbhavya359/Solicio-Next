"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import { Sparkles, TrendingUp } from "lucide-react";

export default function TrendChart({ data }: { data?: any }) {
  if (!data || !data.timeline) return null;

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
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="p-6 sm:p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Revenue Trajectory</h3>
            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Forecast: <strong className="text-white">₹{totalForecast.toLocaleString('en-IN')}</strong> in next {data.forecast?.horizonDays || 7} days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            <span className="text-slate-300">Actual</span>
          </div>
          <div className="w-px h-3 bg-white/20"></div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            <span className="text-slate-400">Predicted</span>
          </div>
        </div>
      </div>

      <div className="h-[250px] sm:h-[350px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={[...chartData, ...forecast]} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
               <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                 <feGaussianBlur stdDeviation="4" result="blur" />
                 <feComposite in="SourceGraphic" in2="blur" operator="over" />
               </filter>
            </defs>
            <CartesianGrid
              stroke="#ffffff"
              strokeOpacity={0.05}
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 600,
                padding: "10px 16px"
              }}
              itemStyle={{ color: "#34d399" }}
              cursor={{ stroke: "#334155", strokeWidth: 1, strokeDasharray: "4 4" }}
            />

            {/* ACTUAL */}
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#34d399"
              strokeWidth={3}
              dot={{ r: 0 }}
              activeDot={{ r: 6, fill: "#34d399", strokeWidth: 0 }}
              filter="url(#glow)"
              animationDuration={1500}
            />

            {/* FORECAST */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#64748b"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              opacity={0.6}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}

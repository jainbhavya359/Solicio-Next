"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "#6366F1", // COGS - indigo
  "#F59E0B", // Expenses - amber
  "#EF4444", // Write-downs - red
  "#10B981", // Net profit - emerald
];

const DARK_BG_STYLES = [
  { bg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400", dot: "bg-indigo-500" },
  { bg: "bg-amber-500/10 border-amber-500/20 text-amber-400", dot: "bg-amber-500" },
  { bg: "bg-rose-500/10 border-rose-500/20 text-rose-400", dot: "bg-rose-500" },
  { bg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", dot: "bg-emerald-500" },
];

type ProfitSummary = {
  cogs: number;
  expenses: number;
  inventoryWriteDowns: number;
  netProfit: number;
  sales: number;
};

export default function ProfitLossWheel({
  summary,
}: {
  summary: ProfitSummary;
}) {
  const data = [
    { name: "COGS", value: summary.cogs },
    { name: "Operating Expenses", value: summary.expenses },
    { name: "Inventory Write-downs", value: summary.inventoryWriteDowns },
    { name: "Net Profit", value: Math.max(summary.netProfit, 0) },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 text-white text-xs shadow-xl">
          <p className="font-bold">{payload[0].name}</p>
          <p className="text-emerald-400 font-black">₹{Number(payload[0].value ?? 0).toLocaleString('en-IN')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#0A0A0A] rounded-[2rem] border border-white/10 p-6 sm:p-8 h-full flex flex-col hover:border-white/20 transition-all"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white">Profit Distribution</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Resource Allocation</p>
        </div>
      </div>

      <div className="relative h-[260px] w-full mb-8 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={4}
              stroke="none"
              cornerRadius={6}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  opacity={0.85}
                  className="hover:opacity-100 transition-opacity cursor-pointer outline-none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Total Revenue</p>
          <p className="text-3xl font-black text-white">
            ₹{(summary.sales / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      {/* LEGEND */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        {data.map((d, i) => {
          const pct = summary.sales > 0 ? Math.min((d.value / summary.sales) * 100, 100) : 0;
          const style = DARK_BG_STYLES[i];
          return (
            <div
              key={d.name}
              className={`group flex flex-col p-4 rounded-2xl border ${style.bg} hover:scale-[1.01] transition-all cursor-default`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`h-2 w-2 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor] ${style.dot}`} style={{ color: COLORS[i] }} />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                  {d.name}
                </span>
              </div>

              <span className="text-sm font-black text-white mb-2">
                ₹{d.value.toLocaleString('en-IN')}
              </span>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLORS[i] }}
                />
              </div>
              <p className="text-[9px] font-bold text-slate-600 mt-1.5">{pct.toFixed(1)}% of revenue</p>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

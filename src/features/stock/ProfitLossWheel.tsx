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
    {
      name: "COGS",
      value: summary.cogs,
    },
    {
      name: "Operating Expenses",
      value: summary.expenses,
    },
    {
      name: "Inventory Write-downs",
      value: summary.inventoryWriteDowns,
    },
    {
      name: "Net Profit",
      value: Math.max(summary.netProfit, 0),
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl sm:rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-8 shadow-sm h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Profit Distribution</h3>
          <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-widest mt-0.5 sm:mt-1">Resource Allocation</p>
        </div>
      </div>

      <div className="relative h-[250px] sm:h-[320px] w-full mb-4 sm:mb-8 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={5}
              stroke="none"
              cornerRadius={6}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
              formatter={(v) => `₹${Number(v ?? 0).toLocaleString()}`}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-0.5 sm:mb-1">Total Sales</p>
          <p className="text-xl sm:text-3xl font-black text-slate-900">
            ₹{(summary.sales / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      {/* LEGEND */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-auto">
        {data.map((d, i) => (
          <div
            key={d.name}
            className="group flex flex-col p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-md transition-all cursor-default"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <span
                className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                {d.name}
              </span>
            </div>

            <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              ₹{d.value.toLocaleString()}
            </span>

            <div className="mt-1 sm:mt-2 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((d.value / summary.sales) * 100, 100)}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

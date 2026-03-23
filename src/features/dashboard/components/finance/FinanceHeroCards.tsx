"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

interface Props {
  data: any;
}

export default function FinanceHeroCards({ data }: Props) {
  if (!data) return null;

  const cards = [
    {
      label: "Gross Revenue",
      value: data.sales,
      trend: "up",
      gradient: "from-emerald-500/10 to-emerald-500/0",
      border: "border-emerald-500/20 group-hover:border-emerald-500/40",
      text: "text-emerald-400",
      icon: <TrendingUp className="w-5 h-5" />,
      subtext: "Total Capital Inflow"
    },
    {
      label: "Gross Profit",
      value: data.grossProfit,
      trend: "up",
      gradient: "from-indigo-500/10 to-indigo-500/0",
      border: "border-indigo-500/20 group-hover:border-indigo-500/40",
      text: "text-indigo-400",
      icon: <Activity className="w-5 h-5" />,
      subtext: `${data.grossMarginPct}% Margin Pre-Expenses`
    },
    {
      label: "Net Profit",
      value: data.netProfit,
      trend: data.netProfit >= 0 ? "up" : "down",
      gradient: data.netProfit >= 0 ? "from-emerald-500/20 to-emerald-500/5" : "from-rose-500/20 to-rose-500/5",
      border: data.netProfit >= 0 ? "border-emerald-500/30 group-hover:border-emerald-500/50" : "border-rose-500/30 group-hover:border-rose-500/50",
      text: data.netProfit >= 0 ? "text-emerald-400" : "text-rose-400",
      icon: <DollarSign className="w-5 h-5" />,
      subtext: "Bottom Line Reality"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className={`group relative overflow-hidden bg-[#0a0a0a] border rounded-[2rem] p-6 sm:p-8 transition-colors ${c.border}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-b ${c.gradient} pointer-events-none`} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{c.label}</span>
              <div className={`p-2 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 ${c.text}`}>
                {c.icon}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter ${c.text}`}>
                ₹{Math.abs(c.value).toLocaleString('en-IN')}
              </span>
              {c.value < 0 && <TrendingDown className="w-6 h-6 text-rose-400" strokeWidth={3} />}
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wide">
              {c.subtext}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

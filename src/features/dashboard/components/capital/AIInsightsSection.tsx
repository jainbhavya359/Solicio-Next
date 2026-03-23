"use client";
import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";

export default function AIInsightsSection() {
  const insights = [
    {
      type: "opportunity",
      title: "Improve score by +30 points",
      desc: "Clear your short-term operational debts by the 14th of this month to instantly decrease utilization ratio.",
      action: "Review Debts",
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      colorClass: "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10",
      iconBg: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      type: "alert",
      title: "Utilization Alert",
      desc: "Your capital utilization has risen above 40%. Consider deploying auxiliary cash reserves to balance it.",
      action: "Optimize Now",
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      colorClass: "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10",
      iconBg: "bg-amber-500/10 border-amber-500/20"
    }
  ];

  return (
    <section className="w-full mt-24">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-400">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tightest">
            Smart Capital <span className="text-cyan-400">Recommendations</span>
          </h2>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">
            Machine Learning Driven Insights
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`p-6 rounded-3xl border ${insight.colorClass} transition-colors group flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-2.5 rounded-xl border ${insight.iconBg}`}>
                  {insight.icon}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">{insight.title}</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                {insight.desc}
              </p>
            </div>
            <button className="self-start text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2 group-hover:text-white transition-colors">
              {insight.action} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows = [
  ["Easy to use interface", true, "Complex"],
  ["Setup time", "5 minutes", "Days / Weeks"],
  ["Real-time stock tracking", true, "Manual updates"],
  ["Smart business insights", true, false],
  ["Profit/Loss at a glance", true, "Reports only"],
  ["Low stock alerts", true, "Basic"],
  ["Trend analysis", true, false],
  ["Mobile friendly", true, "Limited"],
  ["Learning curve", "None", "Steep"],
  ["Pricing", "Affordable", "Expensive"],
];

export function ComparisonSection() {
  return (
    <section className="py-28 bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
       <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-repeat pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Solicio <span className="text-slate-600">vs</span> Others
          </h2>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            See why thousands of forward-thinking businesses are switching out of legacy software.
          </p>
        </motion.div>

        {/* Table Card */}
        <div className="bg-[#111] rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-300">
          {/* Header Row */}
          <div className="grid grid-cols-3 px-6 md:px-10 py-6 border-b border-white/10 text-sm font-bold text-slate-400 tracking-wider uppercase bg-white/5">
            <div className="flex items-center">Feature</div>
            <div className="flex justify-center items-center">
              <span className="px-5 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                Solicio
              </span>
            </div>
            <div className="flex justify-center items-center">
              <span className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm font-bold">
                Legacy Tools
              </span>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {rows.map((row, i) => (
              <motion.div
                key={row[0] as string}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-3 px-6 md:px-10 py-6 text-slate-300 hover:bg-white/5 transition-colors"
              >
                {/* Feature */}
                <div className="font-medium flex items-center text-sm md:text-base">{row[0]}</div>

                {/* Solicio */}
                <div className="flex justify-center items-center">
                  {row[1] === true ? (
                    <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-sm">
                      {row[1]}
                    </span>
                  )}
                </div>

                {/* Others */}
                <div className="flex justify-center items-center text-center">
                  {row[2] === false ? (
                    <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <X className="w-4 h-4 text-slate-500" />
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium text-sm md:text-base">{row[2]}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

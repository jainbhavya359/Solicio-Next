"use client";

import { motion } from "framer-motion";
import { AlertCircle, TrendingDown, HelpCircle, ArrowRight } from "lucide-react";

const problems = [
  {
    icon: AlertCircle,
    title: "Money Gets Stuck",
    description:
      "Business owners record data but still don't know where money is stuck. Cash flow remains a mystery.",
    stat: "67%",
    label: "businesses struggle with cash visibility",
  },
  {
    icon: TrendingDown,
    title: "Stock Surprises",
    description:
      "Stock looks fine until suddenly it isn't. You find out too late when customers are already waiting.",
    stat: "₹2.5L",
    label: "average loss from stockouts yearly",
  },
  {
    icon: HelpCircle,
    title: "Gut-Feel Decisions",
    description:
      "Important decisions are taken on gut feeling, not clarity. No data means no confidence.",
    stat: "4 in 5",
    label: "owners lack data for decisions",
  },
];

export function ProblemsSection() {
  return (
    <section className="py-28 bg-[#050505] relative overflow-hidden transition-colors duration-300">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-8 backdrop-blur shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <AlertCircle className="w-4 h-4" />
            The Problem We Saw
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Software Should Not Just{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">Record</span> Your Business
          </h2>

          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            Most business tools make you a data entry clerk. They record
            everything but tell you nothing. You deserve better.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="relative bg-[#0a0a0a] rounded-3xl p-8 border border-white/10 hover:border-red-500/30 group transition-all duration-300"
            >
              {/* Subtle hover glow inside card */}
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />

              {/* Number */}
              <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                0{i + 1}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <p.icon className="w-7 h-7 text-red-400" />
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white mb-4 relative z-10">
                {p.title}
              </h3>

              <p className="text-slate-400 mb-8 leading-relaxed font-light relative z-10">
                {p.description}
              </p>

              <div className="pt-6 border-t border-white/10 relative z-10">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-1">
                  {p.stat}
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                  {p.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium hover:bg-emerald-500/20 transition-colors cursor-pointer">
            There’s a better way
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

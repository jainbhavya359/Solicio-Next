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
    <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium mb-6">
            <AlertCircle className="w-4 h-4" />
            The Problem We Saw
          </div>

          <h2 className="text-4xl lg:text-5xl font-semibold text-slate-900 dark:text-white mb-6">
            Software Should Not Just{" "}
            <span className="text-red-600 dark:text-red-400">Record</span> Your Business
          </h2>

          <p className="text-lg text-slate-700 dark:text-slate-300">
            Most business tools make you a data entry clerk. They record
            everything but tell you nothing. You deserve better.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="relative bg-white dark:bg-slate-800/50 rounded-2xl p-8
                         border border-slate-200 dark:border-slate-700/50
                         shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.3)]
                         transition-all duration-300"
            >
              {/* Number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-semibold border border-transparent dark:border-red-500/20">
                {i + 1}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-500/10 border border-transparent dark:border-red-500/20 flex items-center justify-center mb-6">
                <p.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                {p.title}
              </h3>

              <p className="text-slate-700 dark:text-slate-400 mb-6 leading-relaxed">
                {p.description}
              </p>

              <div className="pt-5 border-t border-slate-200 dark:border-slate-700/50">
                <div className="text-2xl font-semibold text-red-600 dark:text-red-400">
                  {p.stat}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-500">
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
          transition={{ delay: 0.4 }}
          className="text-center mt-14"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
            There’s a better way
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}



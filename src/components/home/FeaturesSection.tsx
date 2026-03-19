"use client";

import { motion } from "framer-motion";
import {
  Package,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Clock,
  Shield,
  Zap,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Real-Time Stock Tracking",
    desc: "Track every item with purchase & sale history. Know exactly what's in stock, what's moving, and what's sitting idle.",
    bg: "bg-emerald-100",
    color: "text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Instant Profit & Loss",
    desc: "See your profit, loss, and margins at a glance. No more waiting for month-end to know how you're doing.",
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Understand trends, seasonal patterns, and customer behavior. Make decisions backed by data, not guesswork.",
    bg: "bg-orange-100",
    color: "text-orange-600",
  },
  {
    icon: Lightbulb,
    title: "Actionable Insights",
    desc: "Get alerts about slow-moving stock, price opportunities, and cash flow issues before they become problems.",
    bg: "bg-emerald-100",
    color: "text-emerald-600",
  },
  {
    icon: Clock,
    title: "Time-Saving Automation",
    desc: "Automatic calculations, smart suggestions, and one-click reports. Spend less time on data, more on business.",
    bg: "bg-rose-100",
    color: "text-rose-600",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    desc: "Your business data is encrypted and backed up. Access it anytime, anywhere, from any device.",
    bg: "bg-indigo-100",
    color: "text-indigo-600",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-28 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 dark:border-emerald-500/20 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-6">
            <Lightbulb className="w-4 h-4" />
            Powerful Features
          </div>

          <h2 className="text-4xl lg:text-5xl font-semibold text-slate-900 dark:text-white mb-6">
            Everything You Need to{" "}
            <span className="text-emerald-600 dark:text-emerald-400">Grow Your Business</span>
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Inspired by Tally &amp; Khatabook — without the complexity.
            Simple tools that give you clarity, not confusion.
          </p>

          {/* Highlights */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Setup in 5 minutes
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Smart notifications
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Bank-grade security
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 hover:shadow-lg dark:hover:shadow-emerald-900/10 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl ${f.bg} dark:bg-slate-800 shadow-sm dark:shadow-inner flex items-center justify-center mb-6`}
              >
                <f.icon className={`w-6 h-6 ${f.color} dark:text-emerald-400`} />
              </div>

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                {f.title}
              </h3>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


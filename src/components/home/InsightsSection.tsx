"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";

const insights = [
  {
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Low Stock Alert",
    message:
      "Basmati Rice running low. Only 15 units left. Reorder soon!",
    action: "Order Now",
    time: "2 min ago",
  },
  {
    icon: Lightbulb,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Profit Opportunity",
    message:
      "Sugar prices dropped 8%. Good time to stock up for festival season.",
    action: "View Details",
    time: "15 min ago",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Sales Trending Up",
    message:
      "Cooking oil sales up 34% this week. Consider increasing stock.",
    action: "See Trend",
    time: "1 hour ago",
  },
  {
    icon: TrendingDown,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    title: "Slow Moving Stock",
    message:
      "Premium Tea sitting idle for 45 days. Consider a discount sale.",
    action: "Take Action",
    time: "3 hours ago",
  },
];

export function InsightsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
              <Lightbulb className="w-4 h-4" />
              Our USP
            </div>

            <h2 className="text-4xl lg:text-5xl font-semibold text-slate-900 mb-6">
              Insights That Actually{" "}
              <span className="text-emerald-600">Help You Grow</span>
            </h2>

            <p className="text-lg text-slate-600 mb-10 max-w-xl">
              Solicio doesn’t just store your data — it analyzes it.
              Get real-time alerts, spot opportunities, and make decisions
              with confidence. This is what sets us apart.
            </p>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-xl p-5 text-center border">
                <div className="text-2xl font-semibold text-slate-900">
                  ₹2.3L
                </div>
                <div className="text-sm text-slate-600">
                  Cash Recovered
                </div>
                <div className="text-xs text-emerald-600 mt-1">
                  +23%
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 text-center border">
                <div className="text-2xl font-semibold text-slate-900">
                  340
                </div>
                <div className="text-sm text-slate-600">
                  Stock Optimized
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  items
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 text-center border">
                <div className="text-2xl font-semibold text-slate-900">
                  12hrs
                </div>
                <div className="text-sm text-slate-600">
                  Time Saved
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  / week
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <div className="relative space-y-5">
            {insights.map((i, idx) => (
              <motion.div
                key={i.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${i.iconBg} flex items-center justify-center`}
                  >
                    <i.icon className={`w-5 h-5 ${i.iconColor}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-slate-900">
                        {i.title}
                      </h4>
                      <span className="text-xs text-slate-400">
                        {i.time}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 mb-3">
                      {i.message}
                    </p>

                    <button className="text-sm font-medium text-emerald-600 inline-flex items-center gap-1 hover:underline">
                      {i.action}
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Floating badge */}
            <div className="absolute -bottom-6 right-0">
              <span className="px-5 py-2 rounded-full bg-emerald-600 text-white text-sm font-medium shadow-md">
                Real-time updates
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

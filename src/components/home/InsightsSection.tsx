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
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    title: "Low Stock Alert",
    message: "Basmati Rice running low. Only 15 units left. Reorder soon!",
    action: "Order Now",
    time: "2 min ago",
  },
  {
    icon: Lightbulb,
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    title: "Profit Opportunity",
    message: "Sugar prices dropped 8%. Good time to stock up for festival season.",
    action: "View Details",
    time: "15 min ago",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    title: "Sales Trending Up",
    message: "Cooking oil sales up 34% this week. Consider increasing stock.",
    action: "See Trend",
    time: "1 hour ago",
  },
  {
    icon: TrendingDown,
    iconBg: "bg-red-500/10 border-red-500/20",
    iconColor: "text-red-400",
    title: "Slow Moving Stock",
    message: "Premium Tea sitting idle for 45 days. Consider a discount sale.",
    action: "Take Action",
    time: "3 hours ago",
  },
];

export function InsightsSection() {
  return (
    <section className="py-28 bg-[#050505] relative overflow-hidden transition-colors duration-300">
      {/* Ambient glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full point-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 backdrop-blur shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Lightbulb className="w-4 h-4" />
              Our Core Engine
            </div>

            <h2 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
              Insights That Actually{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Help You Grow</span>
            </h2>

            <p className="text-xl text-slate-400 font-light mb-12 max-w-xl leading-relaxed">
              Solicio doesn’t just store your data — it understands it.
              Get real-time alerts, spot opportunities, and make decisions
              with relentless confidence.
            </p>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-[#0a0a0a] rounded-2xl p-6 text-center border border-white/5 hover:border-emerald-500/30 transition-colors duration-300">
                <div className="text-3xl font-bold text-white mb-2">
                  ₹2.3L
                </div>
                <div className="text-sm font-medium text-slate-500 tracking-wide uppercase">
                  Cash Recovered
                </div>
                <div className="text-xs font-bold text-emerald-400 mt-2 bg-emerald-500/10 py-1 rounded-md">
                  +23%
                </div>
              </div>

              <div className="bg-[#0a0a0a] rounded-2xl p-6 text-center border border-white/5 hover:border-emerald-500/30 transition-colors duration-300">
                <div className="text-3xl font-bold text-white mb-2">
                  340
                </div>
                <div className="text-sm font-medium text-slate-500 tracking-wide uppercase">
                  Stock Optimized
                </div>
                <div className="text-xs font-medium text-slate-400 mt-2 bg-white/5 py-1 rounded-md">
                  items
                </div>
              </div>

              <div className="bg-[#0a0a0a] rounded-2xl p-6 text-center border border-white/5 hover:border-emerald-500/30 transition-colors duration-300">
                <div className="text-3xl font-bold text-white mb-2">
                  12h
                </div>
                <div className="text-sm font-medium text-slate-500 tracking-wide uppercase">
                  Time Saved
                </div>
                <div className="text-xs font-medium text-slate-400 mt-2 bg-white/5 py-1 rounded-md">
                  / week
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <div className="relative space-y-4 perspective-[1000px]">
             {/* Background glow behind notifications */}
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent blur-[60px] -z-10" />

            {insights.map((i, idx) => (
              <motion.div
                key={i.title}
                initial={{ opacity: 0, x: 40, rotateY: 10 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 group"
              >
                <div className="flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl border ${i.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <i.icon className={`w-6 h-6 ${i.iconColor}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold tracking-tight text-white text-lg">
                        {i.title}
                      </h4>
                      <span className="text-xs font-medium text-slate-500">
                        {i.time}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 font-light mb-4 leading-relaxed">
                      {i.message}
                    </p>

                    <button className="text-sm font-semibold text-emerald-400 inline-flex items-center gap-1 hover:text-emerald-300 transition-colors group/btn">
                      {i.action}
                      <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Floating badge */}
            <motion.div 
               initial={{ opacity:0, scale:0.8 }}
               whileInView={{ opacity:1, scale:1 }}
               viewport={{ once:true }}
               transition={{ delay: 0.6 }}
               className="absolute -bottom-5 right-4 z-20"
            >
              <span className="px-6 py-2.5 rounded-full bg-emerald-500 text-black text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Real-time updates
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

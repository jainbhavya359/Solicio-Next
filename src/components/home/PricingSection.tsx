"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";

export function PricingSection() {
  return (
    <section className="py-28 bg-[#050505] relative overflow-hidden transition-colors duration-300">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-sm font-medium mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            Simple Pricing
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Plans That Grow{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">With Your Business</span>
          </h2>

          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            Start free, upgrade when you're ready. No hidden fees, no long-term
            contracts. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto pt-8">
          {/* FREE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-colors duration-300 group"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
            <p className="text-slate-400 mb-8 font-light">
              Perfect for getting started
            </p>

            <div className="text-5xl font-bold text-white mb-8 tracking-tight">
              ₹0 <span className="text-lg font-normal text-slate-500 tracking-normal">/month</span>
            </div>

            <button className="w-full py-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors mb-10 group-hover:bg-white/5">
              Start Free
            </button>

            <ul className="space-y-4 text-slate-300 flex-1">
              {[
                "Up to 100 products",
                "Basic stock tracking",
                "Daily sales reports",
                "Mobile app access",
                "Email support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-4">
                  <span className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* PRO (Glowing Card) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative flex flex-col bg-[#0f0f0f] border border-emerald-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.15)] hover:shadow-[0_0_80px_rgba(16,185,129,0.3)] hover:border-emerald-400/50 transition-all duration-300 transform lg:-translate-y-4"
          >
            {/* Animated Glow absolute layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent rounded-3xl pointer-events-none" />

            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Zap className="w-3 h-3" />
              Most Popular
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Pro</h3>
            <p className="text-slate-400 mb-8 font-light relative z-10">
              For growing businesses
            </p>

            <div className="text-5xl font-bold text-white mb-8 tracking-tight relative z-10">
              ₹499{" "}
              <span className="text-lg font-normal text-slate-500 tracking-normal">
                /month
              </span>
            </div>

            <button className="relative w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-slate-200 transition-colors mb-10 z-10 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-[0.98]">
              Start 14-Day Trial
            </button>

            <ul className="space-y-4 text-slate-200 flex-1 relative z-10">
              {[
                "Unlimited products",
                "Real-time stock tracking",
                "Smart insights & alerts",
                "Profit/Loss analytics",
                "Trend analysis",
                "Priority support",
                "Multi-user access",
              ].map((f) => (
                <li key={f} className="flex items-start gap-4">
                  <span className="mt-1 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* BUSINESS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-colors duration-300 group"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Business</h3>
            <p className="text-slate-400 mb-8 font-light">
              For established businesses
            </p>

            <div className="text-5xl font-bold text-white mb-8 tracking-tight">
              ₹999{" "}
              <span className="text-lg font-normal text-slate-500 tracking-normal">
                /month
              </span>
            </div>

            <button className="w-full py-4 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors mb-10 group-hover:bg-white/5">
              Contact Sales
            </button>

            <ul className="space-y-4 text-slate-300 flex-1">
              {[
                "Everything in Pro",
                "Multiple store locations",
                "Advanced reporting",
                "API access",
                "Custom integrations",
                "Dedicated account manager",
                "White-label option",
              ].map((f) => (
                <li key={f} className="flex items-start gap-4">
                  <span className="mt-1 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-slate-400" />
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

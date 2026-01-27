"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";

export function PricingSection() {
  return (
    <section className="py-28 bg-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Simple Pricing
          </div>

          <h2 className="text-4xl lg:text-5xl font-semibold text-slate-900 mb-6">
            Plans That Grow{" "}
            <span className="text-emerald-600">With Your Business</span>
          </h2>

          <p className="text-lg text-slate-600">
            Start free, upgrade when you're ready. No hidden fees, no long-term
            contracts. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {/* FREE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-1">
              Free
            </h3>
            <p className="text-slate-600 mb-6">
              Perfect for getting started
            </p>

            <div className="text-4xl font-semibold text-slate-900 mb-6">
              ₹0 <span className="text-base font-normal text-slate-500">/month</span>
            </div>

            <button className="w-full py-3 rounded-lg border border-slate-300 font-medium mb-8 hover:bg-slate-50 transition">
              Start Free
            </button>

            <ul className="space-y-4 text-sm text-slate-700">
              {[
                "Up to 100 products",
                "Basic stock tracking",
                "Daily sales reports",
                "Mobile app access",
                "Email support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-500" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* PRO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-white border-2 border-emerald-600 rounded-2xl p-8 shadow-lg"
          >
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Most Popular
            </div>

            <h3 className="text-xl font-semibold text-slate-900 mb-1">
              Pro
            </h3>
            <p className="text-slate-600 mb-6">
              For growing businesses
            </p>

            <div className="text-4xl font-semibold text-slate-900 mb-6">
              ₹499{" "}
              <span className="text-base font-normal text-slate-500">
                /month
              </span>
            </div>

            <button className="w-full py-3 rounded-lg bg-emerald-600 text-white font-medium mb-8 hover:bg-emerald-700 transition">
              Start 14-Day Trial
            </button>

            <ul className="space-y-4 text-sm text-slate-700">
              {[
                "Unlimited products",
                "Real-time stock tracking",
                "Smart insights & alerts",
                "Profit/Loss analytics",
                "Trend analysis",
                "Priority support",
                "Multi-user access",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* BUSINESS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm"
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-1">
              Business
            </h3>
            <p className="text-slate-600 mb-6">
              For established businesses
            </p>

            <div className="text-4xl font-semibold text-slate-900 mb-6">
              ₹999{" "}
              <span className="text-base font-normal text-slate-500">
                /month
              </span>
            </div>

            <button className="w-full py-3 rounded-lg border border-slate-300 font-medium mb-8 hover:bg-slate-50 transition">
              Contact Sales
            </button>

            <ul className="space-y-4 text-sm text-slate-700">
              {[
                "Everything in Pro",
                "Multiple store locations",
                "Advanced reporting",
                "API access",
                "Custom integrations",
                "Dedicated account manager",
                "White-label option",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-slate-500" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


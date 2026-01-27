"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "../visual/AnimatedCounter";
import FloatingCard from "../visual/FloatingCard";
import { SignedOut, SignUpButton } from "@clerk/nextjs";
import { SignedIn, SignOutButton } from "@clerk/clerk-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.05),transparent_55%)]" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.035]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-medium w-fit"
            >
              ✨ Smart Insights for Smarter Decisions
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900"
            >
              Run Your Business,{" "}
              <span className="text-emerald-600">Not Just Record It</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              className="text-lg text-slate-600 max-w-xl leading-relaxed"
            >
              Stock, sales, money &amp; decisions — all in one powerful,
              easy-to-use platform. Get insights that actually help you grow.
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <SignedOut>
                <SignUpButton>
                  <button className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition">
                    Start Free Trial →
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <SignOutButton>
                  <button className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-slate-300 hover:bg-slate-100 transition">
                    Logout
                  </button>
                </SignOutButton>
              </SignedIn>
              <button className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-slate-300 hover:bg-slate-100 transition">
                ▶ Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200"
            >
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  <AnimatedCounter end={10000} suffix="+" />
                </div>
                <div className="text-sm text-slate-500">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  <AnimatedCounter end={50} suffix="L+" />
                </div>
                <div className="text-sm text-slate-500">Transactions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  <AnimatedCounter end={4} suffix=".9" />
                </div>
                <div className="text-sm text-slate-500">User Rating</div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — DASHBOARD */}
          <div className="relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-500">Good morning</p>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Business Overview
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  👋
                </div>
              </div>

              {/* Chart */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Revenue Trend</span>
                  <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                    +23%
                  </span>
                </div>
                <div className="flex items-end gap-1 h-28">
                  {[30, 55, 40, 70, 55, 80, 65, 90, 75, 100, 85, 110].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-emerald-200 rounded-t"
                        style={{ height: `${h}%` }}
                      >
                        <div
                          className="w-full bg-emerald-600 rounded-t"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Profit</p>
                  <p className="text-lg font-semibold">₹2,45,000</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Stock Value</p>
                  <p className="text-lg font-semibold">₹8,32,500</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Cards */}
            <FloatingCard className="top-6 -left-12" delay={400}>
              Today’s Sales ₹42,500
            </FloatingCard>
            <FloatingCard className="bottom-24 -right-10" delay={700}>
              Rice stock running low
            </FloatingCard>
            <FloatingCard className="bottom-6 -left-8" delay={900}>
              Pending ₹15,200
            </FloatingCard>
          </div>
        </div>
      </div>
    </section>
  );
}

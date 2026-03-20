"use client";

import { motion } from "framer-motion";
import { UserPlus, Package, BarChart3, Sparkles } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up in Seconds",
    description:
      "Create your free account instantly. No complex forms, no credit card needed.",
    tag: "Takes < 2 minutes",
  },
  {
    icon: Package,
    title: "Add Inventory",
    description:
      "Import existing data or start fresh. Set prices and track stock levels.",
    tag: "Bulk import supported",
  },
  {
    icon: BarChart3,
    title: "Record Sales",
    description:
      "Log sales and purchases seamlessly. Syncs automatically across devices.",
    tag: "Works offline too",
  },
  {
    icon: Sparkles,
    title: "Get Insights",
    description:
      "Watch Solicio analyze data and surface actionable insights.",
    tag: "AI recommendations",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-28 bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-repeat pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 backdrop-blur shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Sparkles className="w-4 h-4" />
            Simple Process
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Get Started in{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Four Easy Steps</span>
          </h2>

          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            From sign-up to insights in minutes. No training needed, no complex
            setup. Just raw clarity.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid lg:grid-cols-4 gap-8 md:gap-12">
          {/* Connector line (Desktop) */}
          <div className="hidden lg:block absolute top-[44px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Icon Container */}
              <div className="relative z-10 flex justify-center mb-8">
                <div className="w-[88px] h-[88px] rounded-full bg-[#111] border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300">
                    <step.icon className="w-7 h-7 text-emerald-400" />
                  </div>
                </div>

                {/* Step number badge */}
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-black text-sm font-bold flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  {i + 1}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold tracking-tight text-white mb-3">
                {step.title}
              </h3>

              <p className="text-slate-400 max-w-xs mx-auto mb-6 font-light leading-relaxed">
                {step.description}
              </p>

              <span className="inline-flex px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 transition-colors">
                {step.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

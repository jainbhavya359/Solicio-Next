"use client";

import { motion } from "framer-motion";
import { UserPlus, Package, BarChart3, Sparkles } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up in Seconds",
    description:
      "Create your free account with just your phone number. No complex forms, no credit card needed.",
    tag: "Takes less than 2 minutes",
  },
  {
    icon: Package,
    title: "Add Your Inventory",
    description:
      "Import your existing data or start fresh. Add products, set prices, and track stock levels easily.",
    tag: "Bulk import supported",
  },
  {
    icon: BarChart3,
    title: "Record Transactions",
    description:
      "Log sales and purchases with a few taps. Everything syncs automatically across all your devices.",
    tag: "Works offline too",
  },
  {
    icon: Sparkles,
    title: "Get Smart Insights",
    description:
      "Watch Solicio analyze your data and surface actionable insights to help you make better decisions.",
    tag: "AI-powered recommendations",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-28 bg-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Simple Process
          </div>

          <h2 className="text-4xl lg:text-5xl font-semibold text-slate-900 mb-6">
            Get Started in{" "}
            <span className="text-emerald-600">Four Easy Steps</span>
          </h2>

          <p className="text-lg text-slate-600">
            From sign-up to insights in minutes. No training needed, no complex
            setup. Just clarity.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid lg:grid-cols-4 gap-12">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-[2px] bg-slate-200" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              {/* Icon */}
              <div className="relative z-10 flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                </div>

                {/* Step number */}
                <div className="absolute -top-2 right-[calc(50%-12px)] translate-x-12 w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-medium flex items-center justify-center">
                  {i + 1}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                {step.title}
              </h3>

              <p className="text-slate-600 max-w-xs mx-auto mb-4">
                {step.description}
              </p>

              <span className="inline-flex px-4 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                {step.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


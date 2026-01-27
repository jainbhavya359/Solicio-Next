"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-28">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-700" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.12),transparent_45%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-5xl mx-auto px-6 text-center text-white"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-sm font-medium mb-8 backdrop-blur">
          <Sparkles className="w-4 h-4" />
          Join 10,000+ Happy Business Owners
        </div>

        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl font-semibold leading-tight mb-6">
          Ready to Run Your Business <br className="hidden sm:block" />
          <span className="text-white">Better?</span>
        </h2>

        {/* Subtext */}
        <p className="text-lg text-white/85 max-w-3xl mx-auto mb-12">
          Stop recording your business blindly. Start understanding it.
          Get the clarity you need to make confident decisions.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="h-14 px-8 bg-white text-emerald-700 rounded-xl font-medium inline-flex items-center gap-2 shadow-lg"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          <button className="h-14 px-8 rounded-xl border border-white/40 text-white font-medium hover:bg-white/10 transition">
            Schedule a Demo
          </button>
        </div>

        {/* Trust Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-white/85">
          {[
            "Free forever plan available",
            "No credit card required",
            "Setup in under 5 minutes",
            "Cancel anytime",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-3 h-3" />
              </span>
              {item}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}


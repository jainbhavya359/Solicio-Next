"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-28 bg-[#050505]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="relative rounded-[3rem] overflow-hidden border border-white/10 bg-[#0a0a0a] px-8 py-20 md:px-20 md:py-32 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Ambient Glow Inside the Box */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/20 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-sm font-medium mb-8 backdrop-blur shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <Sparkles className="w-4 h-4" />
              Join 10,000+ Happy Business Owners
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              Ready to Run Your Business <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Better?</span>
            </h2>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light">
              Stop recording your business blindly. Start understanding it.
              Get the clarity you need to make confident decisions.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative h-14 px-8 bg-white text-black rounded-full font-semibold text-lg inline-flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-all"
              >
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <button className="h-14 px-8 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 backdrop-blur-md transition duration-300 inline-flex items-center justify-center">
                Schedule a Demo
              </button>
            </div>

            {/* Trust Row */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-400 font-medium">
              {[
                "Free forever plan available",
                "No credit card required",
                "Setup in under 5 minutes",
                "Cancel anytime",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

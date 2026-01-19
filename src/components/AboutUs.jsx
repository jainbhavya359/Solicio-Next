"use client";

import { motion } from "framer-motion";
import Tips from "./Tips";

export default function AboutUs() {
  return (
    <>
      {/* Animated Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/30 blur-3xl rounded-full" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-500/30 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 py-28 space-y-32">

        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Why Solicio exists
          </h1>

          <p className="mt-6 text-lg text-slate-300 leading-relaxed">
            Solicio was not built to replace ledgers.
            <br />
            It was built to remove confusion, stress, and guesswork from running a business.
          </p>

          <p className="mt-4 text-slate-400 italic">
            Business should feel clear — not chaotic.
          </p>
        </motion.section>

        {/* THE PROBLEM */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-4xl font-extrabold mb-6 text-center">
            The problem we saw
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Business owners record data but still don’t know where money is stuck.",
              "Stock looks fine until suddenly it isn’t.",
              "Decisions are taken on gut feeling, not clarity.",
            ].map((text, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-slate-300 shadow-lg"
              >
                {text}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* OUR BELIEF */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-extrabold mb-6">
            What we believe
          </h2>

          <p className="text-slate-300 text-lg leading-relaxed">
            Software should not just record your business.
            <br />
            It should help you <span className="text-indigo-400 font-semibold">run it better</span>.
          </p>

          <p className="mt-4 text-slate-400">
            Solicio focuses on clarity, discipline, and decisions — not just entries.
          </p>
        </motion.section>

        {/* WHAT MAKES SOLICIO DIFFERENT */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl font-extrabold text-center mb-16">
            What makes Solicio different
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Decision-first",
                desc: "We don’t stop at records. We surface problems and suggest what to fix.",
              },
              {
                title: "Ledger discipline",
                desc: "Every entry is ordered, traceable, and protected from silent errors.",
              },
              {
                title: "Built for growth",
                desc: "From small shops to growing businesses — Solicio scales with you.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8, scale: 1.03 }}
                className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FOUNDER NOTE */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-extrabold mb-6">
            A note from the builder
          </h2>

          <p className="text-slate-300 text-lg leading-relaxed">
            Solicio is being built with one goal:
            <br />
            to give business owners the same clarity that large companies take for granted.
          </p>

          <p className="mt-4 text-slate-400 italic">
            No fluff. No shortcuts. Just honest software.
          </p>
        </motion.section>

        {/* IMPACT */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-4xl font-extrabold mb-6">
            What Solicio aims to become
          </h2>

          <p className="text-slate-300 text-lg leading-relaxed">
            A trusted operating system for small businesses —
            helping them grow with confidence, discipline, and control.
          </p>
        </motion.section>

        {/* TIPS */}
        <Tips />
      </div>
    </>
  );
}
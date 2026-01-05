"use client"

import { motion } from "framer-motion";
import Tips from "./Tips";

export default function AboutUs() {

  return (
    <>

      {/* Ambient Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-32">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            About Solicio
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-300">
            We’re building the operating system for modern small businesses —
            simplifying growth, finance, compliance, and connections.
          </p>
        </motion.div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-12">
          {[
            {
              title: "Our Mission",
              text:
                "Empower MSMEs with accessible tools, knowledge, and networks so they can grow confidently in a competitive world.",
            },
            {
              title: "Our Vision",
              text:
                "A thriving ecosystem where every local business has equal access to opportunity, capital, and growth.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-xl"
            >
              <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
              <p className="text-slate-300 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* HISTORY */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-extrabold mb-6">Our Journey</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Founded in 2010, Solicio began as a small initiative to bridge gaps
            between local businesses and opportunity. Today, we’ve evolved into
            a platform trusted by hundreds of MSMEs for smarter growth,
            operational clarity, and long-term success.
          </p>
        </motion.section>

        {/* TEAM */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-center mb-14"
          >
            Meet the Team
          </motion.h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              { name: "Alex Johnson", role: "CEO", img: "/team1.jpg" },
              { name: "Maria Gonzalez", role: "COO", img: "/team2.jpg" },
              { name: "Samuel Lee", role: "CTO", img: "/team3.jpg" },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center shadow-xl"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover mb-4 ring-4 ring-indigo-500/30"
                />
                <p className="text-xl font-bold">{member.name}</p>
                <p className="text-slate-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* IMPACT */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-extrabold mb-6">Our Impact</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            We’ve helped 500+ local businesses increase visibility, optimize
            operations, and unlock sustainable growth — strengthening local
            economies and fostering innovation.
          </p>
        </motion.section>

        {/* TIPS */}
        <Tips />

      </div>
    </>
  );
}


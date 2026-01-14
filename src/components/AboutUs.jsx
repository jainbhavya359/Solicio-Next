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




// "use client"

// import { motion } from "framer-motion";
// import Tips from "./Tips";

// export default function AboutUs() {

//   return (
//     <>

//       {/* Ambient Background Blobs */}
//       <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
//       <div className="absolute top-1/2 -right-40 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl" />

//       <div className="relative max-w-7xl mx-auto px-6 space-y-32">

//         {/* HERO */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-center"
//         >
//           <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
//             About Solicio
//           </h1>
//           <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-300">
//             We’re building the operating system for modern small businesses —
//             simplifying growth, finance, compliance, and connections.
//           </p>
//         </motion.div>

//         {/* MISSION & VISION */}
//         <div className="grid md:grid-cols-2 gap-12">
//           {[
//             {
//               title: "Our Mission",
//               text:
//                 "Empower MSMEs with accessible tools, knowledge, and networks so they can grow confidently in a competitive world.",
//             },
//             {
//               title: "Our Vision",
//               text:
//                 "A thriving ecosystem where every local business has equal access to opportunity, capital, and growth.",
//             },
//           ].map((item, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 40 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: true }}
//               className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-xl"
//             >
//               <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
//               <p className="text-slate-300 leading-relaxed">{item.text}</p>
//             </motion.div>
//           ))}
//         </div>

//         {/* HISTORY */}
//         <motion.section
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           viewport={{ once: true }}
//           className="max-w-4xl mx-auto text-center"
//         >
//           <h2 className="text-4xl font-extrabold mb-6">Our Journey</h2>
//           <p className="text-slate-300 text-lg leading-relaxed">
//             Founded in 2010, Solicio began as a small initiative to bridge gaps
//             between local businesses and opportunity. Today, we’ve evolved into
//             a platform trusted by hundreds of MSMEs for smarter growth,
//             operational clarity, and long-term success.
//           </p>
//         </motion.section>

//         {/* TEAM */}
//         <section>
//           <motion.h2
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             viewport={{ once: true }}
//             className="text-4xl font-extrabold text-center mb-14"
//           >
//             Meet the Team
//           </motion.h2>

//           <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
//             {[
//               { name: "Alex Johnson", role: "CEO", img: "/team1.jpg" },
//               { name: "Maria Gonzalez", role: "COO", img: "/team2.jpg" },
//               { name: "Samuel Lee", role: "CTO", img: "/team3.jpg" },
//             ].map((member, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: i * 0.1 }}
//                 viewport={{ once: true }}
//                 whileHover={{ y: -8 }}
//                 className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 text-center shadow-xl"
//               >
//                 <img
//                   src={member.img}
//                   alt={member.name}
//                   className="w-32 h-32 mx-auto rounded-full object-cover mb-4 ring-4 ring-indigo-500/30"
//                 />
//                 <p className="text-xl font-bold">{member.name}</p>
//                 <p className="text-slate-400">{member.role}</p>
//               </motion.div>
//             ))}
//           </div>
//         </section>

//         {/* IMPACT */}
//         <motion.section
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           viewport={{ once: true }}
//           className="max-w-4xl mx-auto text-center"
//         >
//           <h2 className="text-4xl font-extrabold mb-6">Our Impact</h2>
//           <p className="text-slate-300 text-lg leading-relaxed">
//             We’ve helped 500+ local businesses increase visibility, optimize
//             operations, and unlock sustainable growth — strengthening local
//             economies and fostering innovation.
//           </p>
//         </motion.section>

//         {/* TIPS */}
//         <Tips />

//       </div>
//     </>
//   );
// }


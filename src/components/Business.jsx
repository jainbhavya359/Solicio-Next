"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, GraduationCap, ArrowRight, Video, FileText, ChevronRight, Zap, Target, Book, Sparkles } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function Business() {
  return (
    <section className="bg-[#050505] text-white min-h-screen relative overflow-hidden flex flex-col items-center font-sans selection:bg-emerald-500/30">
      {/* Background radial grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat" />
      </div>

      {/* AMBIENT GLOW EFFECTS */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/5 blur-[180px] rounded-full mix-blend-screen pointer-events-none" />

      <Toaster />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 space-y-24">

        {/* HERO HEADER - Solicio Standards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm font-semibold mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Sparkles className="w-4 h-4" />
            Neural Knowledge Hub
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter text-white mb-8 leading-[1.05] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            Master the Art <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">of Business.</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-[#A1A1AA] leading-relaxed font-light max-w-2xl">
            Leverage tactical intelligence modules to bridge knowledge gaps, clarify operational bottlenecks, and accelerate your business trajectory.
          </p>
        </motion.div>

        {/* NEURAL DOUBT RESOLUTION - Ask a Question */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#0A0A0A] rounded-[2.5rem] p-10 md:p-16 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          {/* Decorative background neural patterns */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-900/10 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Tactical Clarification Engine</p>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-6 leading-tight">
              Stuck on a Strategic <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Bottleneck?</span>
            </h2>
            <p className="text-[#A1A1AA] mb-12 text-lg font-light leading-relaxed max-w-2xl">
              Project specific queries regarding finance, operations, or regulatory frameworks into our neural resolution matrix for instant tactical clarity.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 bg-white/5 p-2 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50" />
                <input
                  type="text"
                  placeholder="e.g., Tactical GST registration protocol?"
                  className="w-full bg-transparent border-none text-white placeholder:text-zinc-600 py-4 pl-14 pr-6 focus:outline-none focus:ring-0 font-medium"
                />
              </div>
              <button className="px-8 py-4 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                Execute Query <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* CORE CONCEPTS - ERP & CRM */}
        <div className="grid md:grid-cols-2 gap-12">
          {[
            {
              title: "Enterprise Resource Architecture",
              subtitle: "ERP Intelligence",
              text: "Integrated software systems designed to synchronize inventory, human capital, procurement, and financial reporting into a unified operational dashboard. Essential for tactical scaling.",
              icon: FileText,
              tag: "Digital Core"
            },
            {
              title: "Capital Relationship Matrix",
              subtitle: "CRM Synergy",
              text: "Synchronized systems for managing institutional interactions graphs, sales deployment pipelines, and sentiment-driven marketing. Critical for high-velocity growth.",
              icon: Target,
              tag: "Growth Engine"
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-10 shadow-xl hover:shadow-[0_0_50px_rgba(16,185,129,0.05)] hover:border-white/20 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none">
                <item.icon className="w-48 h-48 rotate-12" />
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="px-3 py-1 rounded-full bg-white/5 text-[#71717A] text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  {item.tag}
                </div>
                <div className="p-3 bg-white/5 text-white rounded-2xl group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 shadow-sm border border-white/5">
                  <item.icon className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400 mb-2">{item.subtitle}</h3>
              <h2 className="text-3xl font-bold text-white mb-5 tracking-tighter group-hover:text-emerald-400 transition-colors">{item.title}</h2>
              <p className="text-[#A1A1AA] leading-relaxed font-light mb-6">{item.text}</p>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:gap-3 transition-all duration-300">
                Explore Module <ChevronRight className="w-4 h-4 text-emerald-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* INSTITUTIONAL UPSKILLING - Skill India */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-[0.4em] whitespace-nowrap px-1">Institutional Competency</span>
            <div className="h-px w-full bg-white/5" />
          </div>

        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
          >
            <div className="p-8 md:p-10 border-b border-white/5 bg-white/5 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 shadow-sm flex items-center justify-center text-emerald-400">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tighter">Skill India <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Digital Hub</span></h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mt-1">Official Institutional Knowledge Portal</p>
                </div>
              </div>
              <a href="https://www.skillindiadigital.gov.in/" target="_blank" className="flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl active:scale-95">
                Access Portal <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="relative bg-[#050505] h-[36rem] p-4 ring-1 ring-inset ring-white/5">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl z-0 pointer-events-none opacity-0 hover:opacity-10 transition-opacity duration-700" />
              <iframe
                src="https://www.skillindiadigital.gov.in/"
                loading="lazy"
                className="w-full h-full rounded-2xl border border-white/10 shadow-inner opacity-80"
                title="Skill India Digital"
              />
            </div>
          </motion.div>
        </div>

        {/* CURATED EDUCATION - Recommended Courses */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-[#71717A] uppercase tracking-[0.4em] whitespace-nowrap px-1">Accelerated Learning Modules</span>
            <div className="h-px w-full bg-white/5" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "Business Management & Strategic Leadership",
                subtitle: "Leadership Matrix",
                desc: "Tactical modules on confident management, effective leadership psychology, and operational synergy.",
                link: "https://www.udemy.com/course/management-business-management-leadership/?couponCode=KEEPLEARNING",
                tag: "Execution"
              },
              {
                title: "Neural Business Analytics Masterclass",
                subtitle: "Analytical Intelligence",
                desc: "High-tier proficiency in Excel, SQL, Tableau, and Power BI for data-driven tactical decisioning.",
                link: "https://www.udemy.com/course/business-analytics-complete-course-w/?couponCode=KEEPLEARNING",
                tag: "Intelligence"
              },
            ].map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-10 hover:shadow-[0_0_50px_rgba(16,185,129,0.05)] hover:border-emerald-500/20 transition-all duration-500 shadow-xl group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="px-3 py-1 rounded-full bg-white/5 text-[#71717A] text-[10px] font-bold uppercase tracking-widest border border-white/10 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-colors">
                    {course.tag}
                  </div>
                  <Book className="w-5 h-5 text-[#3F3F46] group-hover:text-emerald-400 transition-colors" />
                </div>

                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400 mb-2">{course.subtitle}</h3>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tighter group-hover:text-emerald-400 transition-colors leading-tight">{course.title}</h3>
                <p className="text-[#A1A1AA] mb-10 flex-grow font-light leading-relaxed">{course.desc}</p>

                <a
                  href={course.link}
                  target="_blank"
                  className="w-full py-4 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-sm text-center"
                >
                  Project Module
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FOOTER STRIP */}
        <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-30">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#71717A]">Knowledge Synchronicity: Nominal</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#71717A]">Solicio Tactical Edge v2.0</p>
        </div>

      </div>
    </section>
  );
}

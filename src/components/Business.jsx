"use client";

import { motion } from "framer-motion";
import { Search, BookOpen, GraduationCap, ArrowRight, Video, FileText, ChevronRight, Zap, Target, Book, Sparkles } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function Business() {
  return (
    <section className="bg-white min-h-screen relative overflow-hidden flex flex-col items-center font-outfit">
      {/* Background radial grid */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <Toaster />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 space-y-24">

        {/* HERO HEADER - Solicio Standards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-widest mb-6 border border-slate-200/50">
            <BookOpen className="w-3 h-3 text-emerald-600" />
            Neural Knowledge Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tightest leading-none">
            Master the Art <span className="text-emerald-600">of Business</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-slate-500 leading-relaxed font-medium max-w-2xl">
            Leverage tactical intelligence modules to bridge knowledge gaps, clarify operational bottlenecks, and accelerate your business trajectory.
          </p>
        </motion.div>

        {/* NEURAL DOUBT RESOLUTION - Ask a Question */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-900 rounded-[3rem] p-12 md:p-16 shadow-2xl shadow-slate-900/40 relative overflow-hidden"
        >
          {/* Decorative background neural patterns */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Tactical Clarification Engine</p>
            </div>

            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tightest mb-6 leading-none">
              Stuck on a Strategic <span className="text-emerald-500">Bottleneck?</span>
            </h2>
            <p className="text-slate-400 mb-12 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              Project specific queries regarding finance, operations, or regulatory frameworks into our neural resolution matrix for instant tactical clarity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 bg-white/5 p-3 rounded-[2rem] backdrop-blur-md border border-white/10 ring-1 ring-inset ring-white/5 shadow-inner">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50" />
                <input
                  type="text"
                  placeholder="e.g., Tactical GST registration protocol?"
                  className="w-full bg-transparent border-none text-white placeholder:text-slate-500 py-4 pl-14 pr-6 focus:outline-none focus:ring-0 font-semibold"
                />
              </div>
              <button className="px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-3 active:scale-[0.98]">
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
              className="group bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                <item.icon className="w-48 h-48 rotate-12" />
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-100">
                  {item.tag}
                </div>
                <div className="p-3 bg-slate-50 text-slate-900 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  <item.icon className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600 mb-2">{item.subtitle}</h3>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-5 tracking-tightest group-hover:text-emerald-700 transition-colors">{item.title}</h2>
              <p className="text-slate-500 leading-relaxed font-medium mb-6">{item.text}</p>

              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:gap-3 transition-all duration-300">
                Explore Module <ChevronRight className="w-4 h-4 text-emerald-600" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* INSTITUTIONAL UPSKILLING - Skill India */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap px-1">Institutional Competency</span>
            <div className="h-px w-full bg-slate-100" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative"
          >
            <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-600">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tightest">Skill India <span className="text-emerald-600">Digital Hub</span></h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Official Institutional Knowledge Portal</p>
                </div>
              </div>
              <a href="https://www.skillindiadigital.gov.in/" target="_blank" className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]">
                Access Portal <ChevronRight className="w-4 h-4 text-emerald-400" />
              </a>
            </div>

            <div className="relative bg-slate-50 h-[36rem] p-4 ring-1 ring-inset ring-slate-100">
              <div className="absolute inset-0 bg-white/50 backdrop-blur-3xl z-0 pointer-events-none opacity-0 hover:opacity-10 transition-opacity duration-700" />
              <iframe
                src="https://www.skillindiadigital.gov.in/"
                loading="lazy"
                className="w-full h-full rounded-[2rem] border border-slate-200 shdow-inner"
                title="Skill India Digital"
              />
            </div>
          </motion.div>
        </div>

        {/* CURATED EDUCATION - Recommended Courses */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap px-1">Accelerated Learning Modules</span>
            <div className="h-px w-full bg-slate-100" />
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
                className="flex flex-col bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 shadow-xl shadow-slate-200/30 group"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-colors">
                    {course.tag}
                  </div>
                  <Book className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>

                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600 mb-2">{course.subtitle}</h3>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tightest group-hover:text-emerald-700 transition-colors leading-tight">{course.title}</h3>
                <p className="text-slate-500 mb-10 flex-grow font-medium leading-relaxed">{course.desc}</p>

                <a
                  href={course.link}
                  target="_blank"
                  className="w-full py-4 rounded-2xl border-2 border-slate-50 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 text-center transition-all duration-300 shadow-sm"
                >
                  Project Module
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FOOTER STRIP */}
        <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Knowledge Synchronicity: Nominal</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Solicio Tactical Edge v2.0</p>
        </div>

      </div>
    </section>
  );
}

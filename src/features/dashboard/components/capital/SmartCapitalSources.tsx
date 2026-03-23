"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ChevronRight, Zap, Target, AlertTriangle, ArrowRight, Lightbulb, CheckCircle2 } from "lucide-react";

export default function SmartCapitalSources() {
  const sources = [
    { 
      title: "Pradhan Mantri Mudra Yojana", 
      desc: "Growth-focused loans up to ₹10 lakh for MSME acceleration.", 
      link: "https://www.mudra.org.in/",
      eligibilityScore: 84,
      maxFunding: "₹10,00,000",
      prob: "High Approval",
      probColor: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
      tag: "Best Match",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    { 
      title: "CGTMSE Protocol", 
      desc: "Collateral-free security architecture for credits up to ₹2 crore.", 
      link: "https://www.cgtmse.in/",
      eligibilityScore: 72,
      maxFunding: "₹2,00,00,000",
      prob: "Moderate Approval",
      probColor: "text-amber-400 border-amber-500/20 bg-amber-500/10",
      tag: "High Capital Limit",
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    { 
      title: "SIDBI Direct Capital", 
      desc: "High-tier institutional funding for MSME expansion & working capital.", 
      link: "https://www.sidbi.in/",
      eligibilityScore: 91,
      maxFunding: "Custom Scale",
      prob: "Guaranteed",
      probColor: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
      tag: "Fast Approval",
      iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
    },
  ];

  return (
    <section className="w-full mt-24">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-300 text-xs font-bold uppercase tracking-widest mb-4">
             <Target className="w-4 h-4 text-emerald-400" /> Capital Markets
           </div>
           <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tightest">
             Institutional <span className="text-emerald-500">Capital Access</span>
           </h2>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {sources.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -8 }}
            className="bg-[#0A0A0A] border border-white/10 hover:border-white/20 rounded-[2rem] p-8 shadow-xl shadow-none hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between relative overflow-hidden"
          >
            {/* Ambient Glow */}
            <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 pointer-events-none transition-all duration-700 ${s.iconColor.split(' ')[0]}`} style={{ backgroundColor: 'currentColor' }} />

            <div>
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${s.iconColor}`}>
                  <Zap className="w-6 h-6" />
                </div>
                <div className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${s.probColor}`}>
                  {s.tag}
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tightest group-hover:text-emerald-400 transition-colors">{s.title}</h3>
              <p className="text-slate-400 mb-8 leading-relaxed font-medium text-sm">{s.desc}</p>
              
              <div className="w-full h-px bg-white/5 my-6" />

              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div>
                    <span className="block text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1">Max Funding</span>
                    <span className="block text-lg font-bold text-white">{s.maxFunding}</span>
                 </div>
                 <div>
                    <span className="block text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 mb-1">Eligibility Score</span>
                    <div className="flex items-center gap-2">
                      <span className="block text-lg font-bold text-emerald-400">{s.eligibilityScore}/100</span>
                      {s.eligibilityScore >= 80 && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1" />}
                    </div>
                 </div>
              </div>
            </div>
            
            <a
              href={s.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-full py-4 rounded-xl gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 bg-white/5 group-hover:bg-white/10 transition-all border border-transparent group-hover:border-white/10"
            >
              Access Platform <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

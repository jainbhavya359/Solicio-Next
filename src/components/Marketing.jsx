"use client";

import { motion } from "framer-motion";
import { Megaphone, Search, TrendingUp, Users, Target, Rocket, ArrowRight, Wallet, HelpCircle, ChevronRight, Zap, Sparkles, Layout } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function MarketingPage() {
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
            <Megaphone className="w-3 h-3 text-emerald-600" />
            Neural Growth Engine
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tightest leading-none">
            Tactical Marketing <span className="text-emerald-600">for Growth</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-slate-500 leading-relaxed font-medium max-w-2xl">
            Streamlined brand positioning protocols. Zero jargon. Maximum operational impact to accelerate customer acquisition and trust.
          </p>
        </motion.div>

        {/* STEP-BASED MARKETING - Premium Tactical Steps */}
        <div className="space-y-16">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap px-1">Iterative Growth Framework</span>
            <div className="h-px w-full bg-slate-100" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "STEP 01",
                title: "Neural Discovery",
                text: "Optimize visibility across high-yield digital layers: Google, WhatsApp Business, and regional supply chain hubs.",
                icon: Search,
                accent: "text-emerald-600",
                bg: "bg-emerald-50"
              },
              {
                step: "STEP 02",
                title: "Trust Architecture",
                text: "Implement high-fidelity social proof, verified documentation, and transparent capital modeling to normalize buyer confidence.",
                icon: Users,
                accent: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                step: "STEP 03",
                title: "Velocity Scaling",
                text: "Initialize controlled promotional experiments. Synchronize ad-spend only after validating high-conversion tactical channels.",
                icon: TrendingUp,
                accent: "text-amber-600",
                bg: "bg-amber-50"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                  <item.icon className="w-48 h-48 rotate-12" />
                </div>

                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-widest mb-6 ${item.bg} ${item.accent} border border-current opacity-70`}>
                  {item.step}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tightest group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 leading-relaxed font-medium relative z-10 group-hover:text-slate-600 transition-colors">
                  {item.text}
                </p>

                <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:gap-3 transition-all">
                  Initialize Protocol <ChevronRight className="w-4 h-4 text-emerald-600" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PRACTICAL ADVICE - Strategic Panels */}
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-emerald-50/50 border border-emerald-100/50 rounded-[3rem] p-12 shadow-xl shadow-emerald-900/5 relative overflow-hidden group"
          >
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600 mb-3">Capital Allocation</h3>
              <h3 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tightest">
                Optimized <span className="text-emerald-600 text-3xl font-black italic md:text-4xl">Burn Rate</span>
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
                "Initialize with <span className="text-emerald-700 font-extrabold">₹3k–₹5k monthly</span>. Treat marketing as a capital experiment—synchronizing spend only with validated resonance."
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-3">Resonance Framework</h3>
              <h3 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tightest">
                MSME <span className="text-emerald-600">Dominance</span>
              </h3>
              <p className="text-slate-500 leading-relaxed text-lg font-medium">
                Local visibility graphs, high-frequency WhatsApp engagement, and loyalty-driven retention programs outperform global legacy ad networks.
              </p>
            </div>
          </motion.div>
        </div>

        {/* GOVERNMENT ASSISTANCE - Tactical Cards */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap px-1">Institutional Support Layers</span>
            <div className="h-px w-full bg-slate-100" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "MSME Marketing Assistance",
                subtitle: "Supply Chain Expansion",
                text: "Synchronization with federal trade exhibitions, global branding architecture, and high-tier inventory packaging support.",
                icon: Rocket,
                tag: "Market Access"
              },
              {
                title: "Digital MSME Scheme",
                subtitle: "Technological Parity",
                text: "Support for adopting neural digital tools to improve competitive indices and SUPPLY chains in domestic/global grids.",
                icon: Layout,
                tag: "Digital Core"
              },
            ].map((scheme, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 shadow-xl shadow-slate-200/30 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                  <scheme.icon className="w-48 h-48 rotate-12" />
                </div>

                <div className="flex items-center justify-between mb-8">
                  <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    {scheme.tag}
                  </div>
                  <div className="p-3 bg-slate-50 text-slate-900 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                    <scheme.icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600 mb-2">{scheme.subtitle}</h3>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tightest group-hover:text-emerald-700 transition-colors">{scheme.title}</h2>
                <p className="text-slate-500 mb-8 leading-relaxed font-medium">{scheme.text}</p>

                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-emerald-600 transition-all">
                  Access Platform <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* NEURAL CTA - Future AI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-900 rounded-[3rem] p-12 md:p-16 shadow-2xl shadow-slate-900/40 relative overflow-hidden text-white"
        >
          {/* Decorative background neural patterns */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400 tracking-widest">Neural Projection Module</p>
            </div>

            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tightest mb-6 leading-none">
              Marketing Hub, <span className="text-emerald-500">Autonomous</span>
            </h2>
            <p className="text-slate-400 mb-12 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              Soon, Solicio's neural backend will analyze your operational graphs to synthesize target-specific growth maneuvers. Automated traction, zero friction.
            </p>

            <button
              className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-900/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              Get Signal Priority <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* FOOTER STRIP */}
        <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Growth Engine: Synchronized</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Solicio Tactical Edge v2.0</p>
        </div>

      </div>
    </section>
  );
}
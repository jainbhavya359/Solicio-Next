"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Layout, Zap, Package, Activity, CreditCard, BookOpen, Users, ChevronRight, TrendingUp, Sparkles, Layers } from "lucide-react";

const MotionLink = motion(Link);

/* ---------------- TYPES ---------------- */

export type ServiceItem = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  img?: string;
  to?: string;
  tag?: string;
};

/* ---------------- DEFAULT DATA ---------------- */

const defaultServices: ServiceItem[] = [
  {
    title: "Intelligence Hub",
    description:
      "Predictive analytics that highlight operational bottlenecks and strategic focus zones — without manual report synthesis.",
    icon: <Activity className="w-6 h-6" />,
    to: "/businessInsights",
    tag: "Analysis"
  },
  {
    title: "Logistics Console",
    description:
      "Synchronize procurement, sales velocity, and warehouse stock levels in real time — built for high-scale MSME operations.",
    icon: <Layers className="w-6 h-6" />,
    to: "/inventory",
    tag: "Operations"
  },
  {
    title: "Capital Deck",
    description:
      "Neural credit health monitoring and institutional funding discovery — designed to optimize your capital structure.",
    icon: <CreditCard className="w-6 h-6" />,
    to: "/loan",
    tag: "Financials"
  },
  {
    title: "Knowledge Vault",
    description:
      "Institutional clarity on business architecture and financial frameworks — simplified for tactical execution.",
    icon: <BookOpen className="w-6 h-6" />,
    to: "/business",
    tag: "Education"
  },
  {
    title: "Ecosystem Network",
    description:
      "Tactical synchronization with verified wholesalers and institutional supply chain partners for sustainable growth.",
    icon: <Users className="w-6 h-6" />,
    to: "/marketing",
    tag: "Supply Chain"
  },
];

/* ---------------- COMPONENT ---------------- */

export default function Services({
  service_data = defaultServices,
}: { service_data?: ServiceItem[] }): React.ReactElement {
  return (
    <section className="bg-white min-h-screen relative overflow-hidden flex flex-col items-center font-outfit">
      {/* Background radial grid */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 space-y-24">

        {/* HERO HEADER - Solicio Standards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-widest mb-6 border border-slate-200/50">
            <Layout className="w-3 h-3 text-emerald-600" />
            Neural Service Ecosystem
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tightest leading-none">
            Unified Modules <span className="text-emerald-600">for Business</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-slate-500 leading-relaxed font-medium max-w-2xl">
            A synchronized tactical suite designed to automate logistics, clarify financial metadata, and accelerate MSME growth velocity.
          </p>
        </motion.div>

        {/* SERVICE GRID - Premium Tactical Panels */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {service_data.map((item, i) => (
            <MotionLink
              key={item.title}
              href={item.to ?? "#"}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              className="group bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden flex flex-col"
            >
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                <div className="w-48 h-48 rotate-12 flex items-center justify-center">
                  {item.icon ? item.icon : (
                    item.img && <img src={item.img} alt={item.title} className="w-24 h-24" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                {item.tag && (
                  <div className="px-3 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    {item.tag}
                  </div>
                )}
                {/* <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:bg-emerald-600 transition-all duration-500">
                  {item.icon ? item.icon : (
                    item.img && <img src={item.img} alt={item.title} className="w-7 h-7" />
                  )}
                </div> */}
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tightest group-hover:text-emerald-700 transition-colors">
                {item.title}
              </h3>

              <p className="text-slate-500 leading-relaxed font-medium mb-10 flex-grow group-hover:text-slate-600 transition-colors">
                {item.description}
              </p>

              <div className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:gap-3 transition-all duration-300">
                Initialize Module <ChevronRight className="w-4 h-4 text-emerald-600" />
              </div>
            </MotionLink>
          ))}
        </div>

        {/* SECONDARY CTA - Seamless Integration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-900 rounded-[3rem] p-12 md:p-16 shadow-2xl shadow-slate-900/40 relative overflow-hidden text-white"
        >
          {/* Decorative background neural patterns */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-[80px] -ml-24 -mb-24 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Tactical Synchronization</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tightest mb-6 leading-none">
                One Neural Hub. <span className="text-emerald-500">Full Control.</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Experience full operational parity across all modules. Synchronized metadata flows seamlessly between logistics, capital, and intelligence hubs.
              </p>
            </div>
            <button
              className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-900/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              Explore Full Suite
            </button>
          </div>
        </motion.div>

        {/* FOOTER STRIP */}
        <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Ecosystem Status: Synchronized</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Solicio Operational v2.0</p>
        </div>

      </div>
    </section>
  );
}

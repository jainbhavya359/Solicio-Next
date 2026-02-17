"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { ShieldCheck, FileText, Building2, CheckCircle2, ArrowRight, ChevronRight, Zap, ListChecks } from "lucide-react";
import { AddLicenseCard } from "../../components/ui/AddLicenseCard";

export default function Licenses() {
  const [email, setEmail] = useState("");
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

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
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Compliance Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tightest leading-none">
            Licenses <span className="text-emerald-600">& Compliance</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-slate-500 leading-relaxed font-medium max-w-2xl">
            Unified dashboard for tactical compliance monitoring, credential synchronization, and regulatory risk mitigation.
          </p>
        </motion.div>

        {/* MANAGE LICENSES - Dual Column Tactical Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200">
                <ListChecks className="w-6 h-6 rotate-3" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tightest">Credential <span className="text-emerald-600">Sync</span></h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Tactical Asset Registry</p>
              </div>
            </div>

            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-md">
              Synchronize your active business credentials to unlock neural expiration monitoring and automated compliance alerts.
            </p>

            <div className="space-y-6">
              {[
                { label: "Neural Expiration Reminders", desc: "Predictive alerts for license renewals." },
                { label: "Encrypted Credential Locker", desc: "High-security storage for all certifications." },
                { label: "Compliance Index Score", desc: "Real-time health monitoring of your legal stance." }
              ].map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-[2rem] bg-slate-50 border border-slate-100 ring-1 ring-inset ring-slate-200/50 group hover:bg-emerald-50 hover:border-emerald-100 transition-all duration-300"
                >
                  <div className="p-2.5 rounded-xl bg-white text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{feat.label}</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-1">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <ShieldCheck className="w-48 h-48 rotate-12" />
            </div>
            <AddLicenseCard email={email} />
          </motion.div>
        </div>


        {/* ESSENTIAL LICENSES - Strategic Grid */}
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap px-1">Institutional Dependencies</span>
            <div className="h-px w-full bg-slate-100" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "Udyam Registration Matrix",
                subtitle: "MSME Protocol",
                desc: "Primary institutional registry enabling access to tactical subsidies, growth capital, and federal subsidies.",
                link: "https://udyamregistration.gov.in/",
                icon: Building2,
                tag: "Mandatory"
              },
              {
                title: "GST Compliance Interface",
                subtitle: "Tax Layer Synchronization",
                desc: "Requirement for multi-jurisdictional trade and capital normalization across national supply chains.",
                link: "https://www.gst.gov.in/",
                icon: FileText,
                tag: "Regulatory"
              },
              {
                title: "Tactical Trade License",
                subtitle: "Zonal Operations",
                desc: "Municipal authorization for legal operational deployment at specific geographic coordinates.",
                link: null,
                icon: ShieldCheck,
                tag: "Local"
              },
              {
                title: "Establishment Regulation",
                subtitle: "Labour Synchronization",
                desc: "Governance structure for working parameters, human capital coordination, and workplace hygiene.",
                link: null,
                icon: Building2,
                tag: "Labour"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden"
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
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tightest group-hover:text-emerald-700 transition-colors">{item.title}</h2>
                <p className="text-slate-500 mb-8 leading-relaxed font-medium">{item.desc}</p>

                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-emerald-600 transition-all"
                  >
                    Synchronize Portal <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50/50 w-fit px-4 py-2 rounded-full border border-slate-100">
                    <Zap className="w-3 h-3 text-amber-500" /> Varies by jurisdiction
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* FOOTER STRIP */}
        <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Compliance Integrity: Nominal</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Solicio Governance Core v2.0</p>
        </div>

      </div>
    </section>
  );
}

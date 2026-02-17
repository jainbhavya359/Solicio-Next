"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Bell,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Activity,
  Zap,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Target,
  Layers
} from "lucide-react";
import AlertCard from "./AlertCard";
import TodaysDecisions from "./TodaysDecision";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
} as any;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as any;

export default function AlertsFeed({ email }: { email: string }) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [health, setHealth] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    axios
      .get(`/api/alerts?email=${email}`)
      .then((res) => {
        setAlerts(res.data.alerts || []);
        setHealth(res.data.healthSignals || []);
      })
      .finally(() => setLoading(false));
  }, [email]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-[2rem] border border-slate-100 shadow-sm border-dashed">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Analyzing business signals…
        </p>
      </div>
    );
  }

  const criticalCount = alerts.filter(a => a.type === 'danger').length;

  /* ---------- NO ALERTS ---------- */
  if (alerts.length === 0) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="group relative overflow-hidden rounded-[2.5rem] p-10 bg-emerald-50/30 border border-emerald-100 shadow-sm"
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24 bg-emerald-400/10 blur-3xl transition-transform group-hover:scale-125 duration-700" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Operations Status: Clear
              </h3>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">
                Zero Actionable Alerts
              </p>
            </div>
          </div>

          <p className="text-base font-medium text-slate-600 leading-relaxed max-w-lg">
            Your business architecture is currently performing within optimal parameters. No immediate strategic intervention is required today.
          </p>

          {health.length > 0 && (
            <div className="mt-8 grid md:grid-cols-2 gap-4">
              {health.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 border border-white/80 shadow-sm">
                  <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{h.summary}</p>
                    {h.confidence && (
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        {h.confidence} Confidence
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  /* ---------- ALERTS PRESENT ---------- */
  return (
    <div className="space-y-12">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Bell className="w-3 h-3" />
            Strategic Monitoring
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Prioritized <span className="text-emerald-600">Feed</span>
          </h2>
          <p className="text-lg text-slate-500 mt-2 max-w-2xl">
            Real-time operational signals and AI-driven decision points requiring your immediate attention.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stakeholders Notified</p>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Kpi
          label="Pending Actions"
          value={alerts.length}
          icon={Zap}
          variant="amber"
          description="Operational signals"
        />
        <Kpi
          label="Critical Issues"
          value={criticalCount}
          icon={AlertTriangle}
          variant="rose"
          description="High-priority risks"
        />
        <Kpi
          label="Health Signals"
          value={health.length}
          icon={ShieldCheck}
          variant="emerald"
          description="Optimal parameters"
        />
        <Kpi
          label="Strategic Focus"
          value="High"
          icon={Target}
          variant="slate"
          description="Decision Engine active"
        />
      </div>

      {/* Alerts Area */}
      <div className="space-y-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          <AnimatePresence>
            {alerts.map((alert, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <AlertCard alert={alert} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Healthy signals / Secondary checks */}
        {health.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="rounded-[2.5rem] bg-white border border-slate-200 p-10 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Operational Standards</p>
                <h4 className="text-xl font-bold text-slate-900">Health & Compliance Signals</h4>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
              {health.map((h, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="h-6 w-6 rounded-full border-2 border-emerald-100 flex items-center justify-center text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500">
                    <CheckCircle size={12} />
                  </div>
                  <p className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                    {h.summary}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Summary / Major Decisions */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <TodaysDecisions alerts={alerts} />
        </motion.div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  variant = "slate",
  description
}: {
  label: string;
  value: string | number;
  icon: any;
  variant?: "emerald" | "amber" | "rose" | "slate";
  description?: string;
}) {
  const styles = {
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-600 bg-emerald-500/10",
    amber: "border-amber-100 bg-amber-50 text-amber-600 bg-amber-500/10",
    rose: "border-rose-100 bg-rose-50 text-rose-600 bg-rose-500/10",
    slate: "border-slate-200 bg-white text-slate-400 bg-slate-500/5",
  };

  return (
    <div className={`group rounded-3xl border p-6 bg-white transition-all hover:shadow-md hover:border-emerald-200 cursor-default`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <div className={`p-2.5 rounded-2xl ${styles[variant]} transition-colors group-hover:bg-emerald-500 group-hover:text-white`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
      {description && (
        <p className="text-xs font-medium text-slate-400 mt-1 line-clamp-1">{description}</p>
      )}
    </div>
  );
}

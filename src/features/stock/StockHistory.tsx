"use client";

import { motion } from "framer-motion";
import {
  History,
  TrendingUp,
  ShoppingBag,
  Layers,
  Activity,
  Sparkles,
} from "lucide-react";
import StockHistoryTable from "./StockHistoryTable";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
} as any;

export default function StockHistory({
  data,
}: {
  data: any[];
}) {
  if (!data) {
    return (
      <section className="rounded-[2.5rem] border border-white/10 bg-[#0A0A0A] p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400 mb-4" />
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
          Synchronizing Audit Logs...
        </p>
      </section>
    );
  }

  const purchases = data.filter((r: any) => r.voucher === "Purchase");
  const sales = data.filter((r: any) => r.voucher === "Sale");

  const totalPurchaseValue = purchases.reduce((sum, r) => sum + (r.quantity * r.price), 0);
  const totalSaleValue = sales.reduce((sum, r) => sum + (r.quantity * r.price), 0);

  return (
    <div className="space-y-8 font-sans w-full">
      {/* HERO HEADER */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-3 border border-blue-500/20">
              <History className="w-3 h-3" />
              Audit Protocol
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tighter">
              Fiscal <span className="text-blue-400">Manifest</span>
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-2 max-w-xl font-medium leading-relaxed">
              A high-fidelity ledger tracing every asset deployment and revenue event within your inventory ecosystem.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 self-start md:self-auto">
            <Activity className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Log Density</p>
              <p className="text-base font-black text-white">{data.length} Transactions</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI STRIP */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <ManifestKpi
          label="Total Acquisition"
          value={`₹${totalPurchaseValue.toLocaleString('en-IN')}`}
          icon={ShoppingBag}
          color="emerald"
          description="Inbound asset value"
        />
        <ManifestKpi
          label="Total Deployment"
          value={`₹${totalSaleValue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          color="blue"
          description="Outbound revenue value"
        />
        <ManifestKpi
          label="Log Entries"
          value={data.length}
          icon={Layers}
          color="indigo"
          description="Total records processed"
        />
        <ManifestKpi
          label="Audit Integrity"
          value="Verified"
          icon={Sparkles}
          color="cyan"
          description="Neural-ledger verified"
        />
      </motion.div>

      {/* TABLES SECTION */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <StockHistoryTable
          title="Inbound Acquisitions"
          subtitle="Stock successfully added to strategic reserves"
          rows={purchases}
          type="Purchase"
        />
        <StockHistoryTable
          title="Outbound Deployments"
          subtitle="Strategic assets successfully delivered to clients"
          rows={sales}
          type="Sale"
        />
      </motion.section>
    </div>
  );
}

function ManifestKpi({
  label,
  value,
  icon: Icon,
  color,
  description
}: {
  label: string;
  value: string | number;
  icon: any;
  color: "emerald" | "blue" | "indigo" | "cyan";
  description?: string;
}) {
  const styles = {
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  };

  const textStyles = {
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    indigo: "text-indigo-400",
    cyan: "text-cyan-400",
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <div className={`p-2 rounded-xl border ${styles[color]} group-hover:scale-110 transition-all`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className={`text-2xl font-black tracking-tight ${textStyles[color]}`}>{value}</p>
      {description && (
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">{description}</p>
      )}
    </div>
  );
}

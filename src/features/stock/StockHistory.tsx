"use client";

import { motion } from "framer-motion";
import {
  History,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Layers,
  Activity
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
      <section className="rounded-[2.5rem] border border-slate-200 bg-white p-12 shadow-sm border-dashed flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-emerald-600 mb-4" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
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
    <div className="space-y-12 font-sans">
      {/* HERO HEADER */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3">
            <History className="w-3 h-3" />
            Audit Protocol
          </div>
          <div className="hidden sm:block">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">
              Fiscal <span className="text-emerald-600">Manifest</span>
            </h2>
            <p className="text-lg text-slate-500 mt-2 max-w-2xl font-medium">
              A high-fidelity ledger tracing every asset deployment and revenue event within your inventory ecosystem.
            </p>
          </div>
          {/* Mobile Title */}
          <h2 className="block sm:hidden text-2xl font-black text-slate-900 tracking-tighter">
            Fiscal <span className="text-emerald-600">Manifest</span>
          </h2>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 sm:px-5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group self-start sm:self-auto">
          <div className="absolute inset-0 bg-emerald-500/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 relative z-10" />
          <div className="relative z-10">
            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Log Density</p>
            <p className="text-xs sm:text-base font-black text-slate-900 mt-0.5 sm:mt-1">{data.length} Transactions</p>
          </div>
        </div>
      </motion.div>

      {/* KPI STRIP - Dense 2x2 Grid on Mobile */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
      >
        <Kpi
          label="Total Acquisition"
          value={`₹${totalPurchaseValue.toLocaleString()}`}
          icon={ShoppingBag}
          variant="slate"
          description="Inbound asset value"
        />
        <Kpi
          label="Total Deployment"
          value={`₹${totalSaleValue.toLocaleString()}`}
          icon={TrendingUp}
          variant="emerald"
          description="Outbound revenue value"
        />
        <Kpi
          label="Log Entries"
          value={data.length}
          icon={Layers}
          variant="slate"
          description="Total records processed"
        />
        <Kpi
          label="Audit Integrity"
          value="Verified"
          icon={Sparkles}
          variant="emerald"
          description="Neural-ledger verified"
        />
      </motion.div>

      {/* TABLES SECTION */}
      <motion.section
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
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
  variant?: "emerald" | "slate";
  description?: string;
}) {
  return (
    <div className="group rounded-2xl sm:rounded-3xl border border-slate-100 p-4 sm:p-6 bg-white transition-all hover:shadow-xl hover:border-emerald-200 cursor-default relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-slate-50 rounded-full -mr-8 -mt-8 sm:-mr-12 sm:-mt-12 group-hover:bg-emerald-50 transition-colors" />

      <div className="relative z-10 flex items-center justify-between mb-2 sm:mb-4">
        <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[70%]">{label}</span>
        <div className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl ${variant === 'emerald' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-400'} transition-all group-hover:scale-110`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div className="relative z-10">
        <p className={`text-xl sm:text-3xl font-black tracking-tighter leading-none ${variant === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>
          {value}
        </p>
        {description && (
          <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 mt-1 sm:mt-2 uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity truncate">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}




"use client";
import { motion } from "framer-motion";
import { Package, TrendingUp, Layers, AlertTriangle } from "lucide-react";

export default function InventoryHero({ summary, loading }: { summary: any, loading: boolean }) {
  const stockValue = summary?.totalStockValue || 0;
  const productCount = summary?.productCount || 0;
  const totalUnits = summary?.totalQuantity || 0;
  const riskPct = summary?.slowStockPct || 0;

  return (
    <section className="relative w-full pt-32 pb-16 overflow-hidden flex flex-col items-center">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-repeat pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10 px-6 w-full max-w-[1400px] mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <Package className="w-4 h-4" /> Operations Command Center
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
          Your Inventory.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Fully Controlled.</span>
        </h1>
        <p className="text-lg md:text-xl text-[#A1A1AA] max-w-2xl mx-auto font-light mb-16 leading-relaxed">
          Tactical real-time stock monitoring, procurement intelligence, and instantaneous capital deployment tracking.
        </p>

        {/* Global Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-4 sm:px-8">
          
          <MetricCard 
             label="Net Stock Value"
             value={`₹${stockValue.toLocaleString('en-IN')}`}
             icon={<TrendingUp className="w-5 h-5" />}
             loading={loading}
             color="emerald"
          />

          <MetricCard 
             label="Active Products"
             value={productCount.toLocaleString()}
             icon={<Package className="w-5 h-5" />}
             loading={loading}
             color="blue"
          />

          <MetricCard 
             label="Units in Motion"
             value={totalUnits.toLocaleString('en-IN')}
             icon={<Layers className="w-5 h-5" />}
             loading={loading}
             color="indigo"
          />

          <MetricCard 
             label="Capital at Risk"
             value={`${riskPct}%`}
             icon={<AlertTriangle className="w-5 h-5" />}
             loading={loading}
             color={riskPct > 15 ? "rose" : "amber"}
          />
          
        </div>
      </motion.div>
    </section>
  );
}

function MetricCard({ label, value, icon, loading, color }: { label: string, value: string, icon: React.ReactNode, loading: boolean, color: "emerald" | "blue" | "indigo" | "rose" | "amber" }) {
    const colorStyles = {
        emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.05)]",
        blue: "bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.05)]",
        indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.05)]",
        rose: "bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.05)]",
        amber: "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.05)]"
    };

    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col items-start relative overflow-hidden group hover:border-white/20 transition-all">
            <div className={`w-10 h-10 rounded-xl flex flex-shrink-0 items-center justify-center border mb-4 ${colorStyles[color]}`}>
               {icon}
            </div>
            <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-2xl md:text-3xl font-black text-white">
               {loading ? <div className="h-8 w-24 bg-white/10 animate-pulse rounded" /> : value}
            </div>
        </div>
    );
}

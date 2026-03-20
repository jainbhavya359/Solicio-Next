"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Package, TrendingDown,
  ArrowRight, ShieldCheck, Layers, Search, ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export interface SlowMovingItem {
  product: string;
  unit: string;
  quantity: number;
  value: number;
  daysSinceLastSale: number | null;
  category: "slow" | "dead";
}

interface Props {
  slowMovingCount: number;
  slowStockValue: number;
  slowMoving: SlowMovingItem[];
  open: boolean;
  onToggle: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }
  },
} as any;

export default function SlowMovingStockView({
  slowMovingCount, slowStockValue, slowMoving, open, onToggle,
}: Props) {
  const isHealthy = slowMovingCount === 0;

  const avgStallDays = slowMoving.length > 0
    ? Math.round(slowMoving.reduce((acc, item) => acc + (item.daysSinceLastSale || 0), 0) / slowMoving.length)
    : 0;

  return (
    <motion.section initial="hidden" animate="visible" variants={fadeInUp} className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* KPI STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Kpi label="Total Stalled" value={slowMovingCount} icon={Package} variant="amber" description="Actionable SKUs" />
        <Kpi label="Value at Risk" value={`₹${slowStockValue.toLocaleString()}`} icon={TrendingDown} variant="rose" description="Blocked capital" />
        <Kpi label="Avg. Stall Days" value={`${avgStallDays}d`} icon={ShieldCheck} variant="slate" description="Since last sale" />
        <Kpi label="Health Index" value={isHealthy ? "100%" : "68%"} icon={CheckCircle} variant={isHealthy ? "emerald" : "amber"} description="Efficiency" />
      </div>

      <div className="flex justify-end">
         {!isHealthy && (
           <button onClick={onToggle} className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white border border-white/10 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all shadow-lg active:scale-95">
             {open ? "Hide Inventory Breakdown" : "Review Stalled Stock"}
             {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
           </button>
         )}
      </div>

      <AnimatePresence>
        {!isHealthy && open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-transparent border border-white/10 rounded-3xl shadow-sm overflow-hidden mb-6">
              
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product Info</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">In Stock</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Value</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Stall Duration</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {slowMoving.map((item, idx) => (
                      <motion.tr key={`${item.product}-${item.unit}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="group hover:bg-white/5 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-11 w-11 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center group-hover:bg-amber-500/10 group-hover:text-amber-400 border border-white/5 transition-colors">
                              <Package size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-white capitalize">{item.product}</p>
                              <p className="text-xs font-medium text-slate-400">{item.unit}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-white">{item.quantity}</span>
                            <span className="text-xs font-medium text-slate-400 lowercase">{item.unit}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className="text-base font-bold text-rose-400">₹{item.value.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-slate-300">
                              {item.daysSinceLastSale === null ? "Absolute Zero" : `${item.daysSinceLastSale} days`}
                            </span>
                            <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${item.category === 'dead' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]'}`} style={{ width: `${Math.min(100, ((item.daysSinceLastSale || 90) / 90) * 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.category === "slow" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"}`}>
                            {item.category === "slow" ? "Slow Moving" : "Dead Stock"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/inventory?action=sale&product=${item.product}`} className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:border-amber-400/50 hover:text-amber-400 hover:bg-amber-500/10 transition-all">
                              <ArrowUpRight size={14} />
                            </Link>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE LIST */}
              <div className="block sm:hidden">
                <div className="divide-y divide-white/10">
                  {slowMoving.map((item, idx) => (
                    <div key={`mob-${item.product}-${item.unit}`} className="p-4 bg-transparent border-t border-white/5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center shrink-0 border border-white/5">
                            <Package size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm capitalize leading-tight">{item.product}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">{item.unit}</p>
                          </div>
                        </div>
                        <Link href={`/inventory?action=sale&product=${item.product}`} className="h-8 w-8 rounded-lg flex items-center justify-center bg-white/5 text-slate-400 border border-white/10">
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pl-13">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Value Stuck</p>
                          <p className="text-sm font-bold text-rose-400">₹{item.value.toLocaleString()}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Stock</p>
                          <p className="text-sm font-bold text-slate-300">{item.quantity} <span className="text-[10px] text-slate-500 font-medium">{item.unit}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4">
              <AlertTriangle className="text-amber-500 shrink-0 w-6 h-6 mt-1" />
              <div>
                <p className="font-bold text-amber-400 text-sm sm:text-base tracking-[0.2em] uppercase">Strategic Insight</p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mt-2">
                  High-risk items found in your inventory. Consider liquidation or promotional discounting to free up <span className="font-bold text-white">₹{slowStockValue.toLocaleString()}</span> in blocked working capital.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isHealthy && (
        <div className="flex flex-col items-center justify-center py-12 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 border-dashed">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <p className="text-lg font-bold text-white">Your Inventory is Optimized</p>
          <p className="text-sm text-slate-400 mt-1 uppercase tracking-widest font-bold">All items showing optimal turnover</p>
        </div>
      )}
    </motion.section>
  );
}

function Kpi({ label, value, icon: Icon, variant = "slate", description }: any) {
  const styles = {
    emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    rose: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    slate: "border-white/10 bg-white/5 text-slate-400",
  } as any;

  return (
    <div className={`group rounded-2xl sm:rounded-3xl border border-white/5 p-4 sm:p-6 bg-white/5 transition-all hover:bg-white/10`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <div className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl ${styles[variant]} transition-colors group-hover:scale-110`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
      <p className="text-xl sm:text-3xl font-bold text-white tracking-tight">{value}</p>
      {description && <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-1 line-clamp-1">{description}</p>}
    </div>
  );
}

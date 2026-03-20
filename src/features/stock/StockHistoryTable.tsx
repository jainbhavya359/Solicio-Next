"use client";

import { motion } from "framer-motion";
import {
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Hash,
  Box
} from "lucide-react";

interface StockRow {
  _id: string;
  name: string;
  voucher: "Purchase" | "Sale";
  quantity: number;
  unit: string;
  price: number;
  entryNo: string;
  date: string;
}

interface Props {
  title: string;
  subtitle: string;
  rows: StockRow[];
  type: "Purchase" | "Sale";
}

const containerVars = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVars = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export default function StockHistoryTable({
  title,
  subtitle,
  rows,
  type,
}: Props) {
  const isPurchase = type === "Purchase";
  const Icon = isPurchase ? ArrowUpRight : ArrowDownRight;
  const colorClass = isPurchase ? "text-emerald-400" : "text-rose-400";
  const bgClass = isPurchase ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400";
  const rowAccent = isPurchase ? "hover:border-emerald-500" : "hover:border-rose-500";

  return (
    <div className="flex flex-col h-full font-sans bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all duration-500">
      {/* HEADER */}
      <div className="p-6 border-b border-white/5 flex items-center gap-4">
        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border ${bgClass} flex-shrink-0`}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white tracking-tight leading-none">
            {title}
          </h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
            {subtitle}
          </p>
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-white/5 border-b border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
        <div className="col-span-2">Date</div>
        <div className="col-span-4">Asset</div>
        <div className="col-span-2 text-right">Qty</div>
        <div className="col-span-2 text-right">Value</div>
        <div className="col-span-2 text-right">ID</div>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center flex-1">
          <div className="w-14 h-14 rounded-3xl bg-white/5 text-slate-600 border border-white/10 flex items-center justify-center mb-4">
            <Package size={24} />
          </div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
            Zero records detected
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="divide-y divide-white/5 overflow-y-auto max-h-[420px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        >
          {rows.map((row) => (
            <motion.div
              key={row._id}
              variants={itemVars}
              className={`
                flex flex-col gap-3 p-4 sm:grid sm:grid-cols-12 sm:gap-4 sm:px-6 sm:py-4 sm:items-center 
                hover:bg-white/5 transition-all duration-200 group cursor-default border-l-2 border-transparent ${rowAccent}
              `}
            >
              {/* Mobile row */}
              <div className="flex sm:hidden items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">
                    {new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">{new Date(row.date).getFullYear()}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                  <Hash size={9} />
                  <span className="text-[9px] font-bold uppercase tracking-tight">{row.entryNo}</span>
                </div>
              </div>

              <div className="flex sm:hidden items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center">
                    <Box size={13} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white capitalize truncate max-w-[150px]">{row.name}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{row.quantity} {row.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`block text-sm font-black tabular-nums ${colorClass}`}>₹{(row.quantity * row.price).toLocaleString('en-IN')}</span>
                  <span className="block text-[9px] font-bold text-slate-500 tabular-nums">@ {row.price}</span>
                </div>
              </div>

              {/* Desktop cells */}
              <div className="hidden sm:flex col-span-2 flex-col">
                <span className="text-[11px] font-black text-white">{new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">{new Date(row.date).getFullYear()}</span>
              </div>

              <div className="hidden sm:flex col-span-4 items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 text-slate-500 flex items-center justify-center group-hover:border-white/20 transition-all">
                  <Box size={13} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white capitalize truncate max-w-[120px]">{row.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{row.unit}</p>
                </div>
              </div>

              <div className="hidden sm:flex col-span-2 justify-end">
                <span className="text-sm font-black text-white tabular-nums">{row.quantity}</span>
              </div>

              <div className="hidden sm:flex col-span-2 flex-col items-end">
                <span className={`text-sm font-black tabular-nums ${colorClass}`}>₹{(row.quantity * row.price).toLocaleString('en-IN')}</span>
                <span className="text-[9px] font-bold text-slate-500 tabular-nums">@ {row.price}</span>
              </div>

              <div className="hidden sm:flex col-span-2 justify-end">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400">
                  <Hash size={9} className="text-slate-600" />
                  <span className="text-[9px] font-black tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[70px]">{row.entryNo}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

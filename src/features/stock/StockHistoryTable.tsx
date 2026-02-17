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
      staggerChildren: 0.05,
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
  const accentColor = isPurchase ? "text-emerald-600" : "text-rose-600";
  const bgAccent = isPurchase ? "bg-emerald-50" : "bg-rose-50";

  return (
    <div className="flex flex-col h-full font-sans">
      {/* HEADER */}
      <div className="mb-6 flex items-center gap-4">
        <div className={`h-12 w-12 rounded-2xl ${bgAccent} ${accentColor} flex items-center justify-center shadow-sm border border-white/50`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">
            {title}
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* TABLE HEADER */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <div className="col-span-1">Date</div>
          <div className="col-span-4">Asset Identification</div>
          <div className="col-span-2 text-right">Qty</div>
          <div className="col-span-2 text-right">Value (₹)</div>
          <div className="col-span-3 text-right">Identifier</div>
        </div>

        {rows.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-200 flex items-center justify-center mb-4">
              <Package size={32} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Zero records detected
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVars}
            initial="hidden"
            animate="visible"
            className="divide-y divide-slate-50 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
          >
            {rows.map((row) => (
              <motion.div
                key={row._id}
                variants={itemVars}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors group cursor-default"
              >
                {/* Date */}
                <div className="col-span-1">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-slate-900">
                      {new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(row.date).getFullYear()}
                    </span>
                  </div>
                </div>

                {/* Product */}
                <div className="col-span-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                      <Box size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 capitalize truncate max-w-[120px]">
                        {row.name}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {row.unit}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Qty */}
                <div className="col-span-2 text-right">
                  <span className="text-sm font-black text-slate-900 tabular-nums">
                    {row.quantity}
                  </span>
                </div>

                {/* Value */}
                <div className="col-span-2 text-right">
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-black tabular-nums ${accentColor}`}>
                      ₹{(row.quantity * row.price).toLocaleString()}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 tabular-nums">
                      @ {row.price}
                    </span>
                  </div>
                </div>

                {/* Identifier */}
                <div className="col-span-3 text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 text-white shadow-sm">
                    <Hash size={10} className="text-slate-500" />
                    <span className="text-[10px] font-black tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                      {row.entryNo}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

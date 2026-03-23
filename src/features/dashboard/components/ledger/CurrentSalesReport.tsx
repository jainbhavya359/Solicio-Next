"use client";

import { motion } from "framer-motion";
import { CopyRight, FileText, ChevronRight, Hash } from "lucide-react";
import Link from "next/link";

interface Props {
  salesData: any[]; // Assuming an array of sales from /api/sellStock
}

export default function CurrentSalesReport({ salesData = [] }: Props) {
  if (!salesData || salesData.length === 0) return null;

  // We only highlight recent activity (Top 5)
  const recentSales = salesData.slice(0, 5);

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8 mt-6 relative overflow-hidden group">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Current Sales Report</h3>
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">Most Recent Invoices Generated</p>
          </div>
        </div>
        
        <Link 
          href="/transactions" 
          className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-orange-300 uppercase tracking-widest transition-colors"
        >
          View Master Directory <ChevronRight size={14} />
        </Link>
      </div>

      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="min-w-max flex items-center gap-3 pb-2">
          {recentSales.map((sale, i) => (
            <motion.div
              key={sale._id || i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 w-64 p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 hover:border-orange-500/30 transition-colors group/card"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-medium text-slate-500">{new Date(sale.date).toISOString().split("T")[0]}</span>
                <span className="px-2 py-0.5 rounded-lg bg-white/5 text-white text-[10px] font-mono border border-white/10 flex items-center gap-1">
                  <Hash size={10} /> {sale.entryNo}
                </span>
              </div>
              <p className="font-bold text-white capitalize truncate text-sm">{sale.name}</p>
              
              <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Qty</p>
                  <p className="text-lg font-black text-orange-400">{sale.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est Value</p>
                  <p className="text-base font-bold text-white">₹{(sale.quantity * sale.price).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          <Link href="/transactions" className="flex-shrink-0 w-32 h-[130px] p-4 rounded-2xl bg-white/5 border border-dashed border-white/20 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all outline-none flex flex-col items-center justify-center text-slate-400 hover:text-orange-400 gap-2">
            <ChevronRight size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-center">View<br/>All History</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

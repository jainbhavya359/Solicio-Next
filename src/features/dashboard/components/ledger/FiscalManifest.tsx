"use client";

import { motion } from "framer-motion";
import { Package, TrendingUp, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  data: any[];
}

export default function FiscalManifest({ data = [] }: Props) {
  if (!data || data.length === 0) return null;

  const purchases = data.filter(r => r.voucher === "Purchase" || r.type === "Purchase").slice(0, 5);
  const sales = data.filter(r => r.voucher === "Sale" || r.type === "Sale").slice(0, 5);

  const totalPurchaseValue = purchases.reduce((sum, r) => sum + (r.quantity * (r.price || 0)), 0);
  const totalSaleValue = sales.reduce((sum, r) => sum + (r.quantity * (r.price || 0)), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      {/* Inbound / Acquisitions */}
      <div className="bg-[#050505] border border-white/5 rounded-[2rem] p-6 sm:p-8 flex flex-col hover:border-white/10 transition-all">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Acquisitions</h3>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Inbound Asset Value</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-black text-emerald-400">₹{totalPurchaseValue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {purchases.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#0a0a0a] text-slate-400 group-hover:text-emerald-400 transition-colors">
                  <Package size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white capitalize">{item.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">#{item.entryNo}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-500">+{item.quantity} <span className="text-[10px] text-emerald-500/50 uppercase">{item.unit}</span></p>
                <p className="text-[10px] font-bold text-slate-500">₹{(item.price || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
          {purchases.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-6 border border-dashed border-white/10 rounded-2xl text-slate-500 text-sm font-medium">
              No recent acquisitions found
            </div>
          )}
        </div>
      </div>

      {/* Outbound / Deployments */}
      <div className="bg-[#050505] border border-white/5 rounded-[2rem] p-6 sm:p-8 flex flex-col hover:border-white/10 transition-all">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Deployments</h3>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Outbound Revenue Events</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-black text-blue-400">₹{totalSaleValue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {sales.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#0a0a0a] text-slate-400 group-hover:text-blue-400 transition-colors">
                  <Package size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white capitalize">{item.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">#{item.entryNo}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-blue-500">-{item.quantity} <span className="text-[10px] text-blue-500/50 uppercase">{item.unit}</span></p>
                <p className="text-[10px] font-bold text-slate-500">₹{(item.price || 0).toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
          {sales.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-6 border border-dashed border-white/10 rounded-2xl text-slate-500 text-sm font-medium">
              No recent deployments found
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

"use client";

import { Sparkles } from "lucide-react";

interface Props {
  parties: any[];
}

export default function PartyInsightPanel({ parties = [] }: Props) {
  if (!parties || parties.length === 0) return null;

  const customers = parties.filter(p => p.type === "Customer");
  const suppliers = parties.filter(p => p.type === "Supplier");

  const totalSales = customers.reduce((sum, p) => sum + (p.totalSales || 0), 0);
  
  // Insight 1: Concentration Risk
  const top3Customers = [...customers]
     .sort((a,b) => (b.totalSales || 0) - (a.totalSales || 0))
     .slice(0, 3);
     
  const top3Sales = top3Customers.reduce((sum, p) => sum + (p.totalSales || 0), 0);
  const revenueConcentration = totalSales > 0 ? (top3Sales / totalSales) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-[2rem] p-6 lg:p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Sparkles className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4">Neural Relationship Synthesis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {revenueConcentration > 50 && (
              <div className="bg-[#050505]/50 border border-white/5 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Concentration Risk</p>
                <p className="text-sm text-slate-300">
                  Your top 3 customers generate <span className="text-amber-400 font-bold">{revenueConcentration.toFixed(0)}%</span> of total aggregated revenue. Diversification recommended.
                </p>
              </div>
            )}
            
            <div className="bg-[#050505]/50 border border-white/5 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Network Profile</p>
              <p className="text-sm text-slate-300">
                Operating active transactional networks with <span className="text-emerald-400 font-bold">{customers.length}</span> downstream clients and <span className="text-rose-400 font-bold">{suppliers.length}</span> tier-1 suppliers.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

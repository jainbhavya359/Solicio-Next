"use client";

import { motion } from "framer-motion";
import { Activity, Archive, BarChart3, Database, DollarSign, Layers, Plus, ShoppingBag, TrendingUp } from "lucide-react";

interface Props {
  data: any;
  onAddExpense: () => void;
  onAddTax: () => void;
  onAddWriteDown: () => void;
}

export default function ProfitBreakdownGrid({ data, onAddExpense, onAddTax, onAddWriteDown }: Props) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start mb-6">
      
      {/* LEFT COLUMN: Revenue & Costs */}
      <motion.section
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-6 sm:p-8 hover:border-indigo-500/30 transition-all group shadow-sm h-full flex flex-col"
      >
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
               <Database className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white tracking-tight">Revenue & Yield</h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Top Line Formulation</p>
             </div>
           </div>
        </div>

        <div className="space-y-1 flex-1">
          <LedgerRow label="Opening Capital Stock" value={data.openingStock} icon={Layers} />
          <LedgerRow label="Procurement Purchases" value={data.purchases} icon={ShoppingBag} />
          <LedgerRow label="Closing Capital Stock" value={data.closingStock} icon={Archive} />
          
          <div className="my-4 border-b border-dashed border-white/10" />
          
          <LedgerRow label="Cost of Goods Sold (COGS)" value={data.cogs} icon={BarChart3} isAlert />
          
          <div className="my-4 border-b border-white/5" />
          
          <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mt-auto">
             <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Gross Margin Profile</span>
                <span className="text-xl font-black text-indigo-400">₹{data.grossProfit.toLocaleString('en-IN')}</span>
             </div>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{data.grossMarginPct}% Effective Rate</p>
          </div>
        </div>
      </motion.section>

      {/* RIGHT COLUMN: Expenses & Outflows */}
      <motion.section
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-6 sm:p-8 hover:border-amber-500/30 transition-all group shadow-sm h-full flex flex-col"
      >
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
             <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
               <Activity className="w-6 h-6" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white tracking-tight">Opex & Liability</h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Cost Center Deductions</p>
             </div>
           </div>
        </div>

        <div className="space-y-1 flex-1">
          <LedgerRow label="Enterprise Operating Expenses" value={data.expenses} icon={DollarSign} onAdd={onAddExpense} isAlert />
          <LedgerRow label="Statutory Taxes Paid" value={data.taxesPaid || 0} icon={DollarSign} onAdd={onAddTax} isAlert />
          <LedgerRow label="Inventory Write-downs (Loss)" value={data.inventoryWriteDowns} icon={Archive} onAdd={onAddWriteDown} isAlert />
          
          <div className="my-4 border-b border-dashed border-white/10" />
          
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] mt-auto">
             <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-400">Total Deductions</span>
                <span className="text-xl font-black text-slate-300">₹{(data.expenses + (data.taxesPaid||0) + data.inventoryWriteDowns).toLocaleString('en-IN')}</span>
             </div>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pre-tax & Post-tax capital drain</p>
          </div>
        </div>
      </motion.section>

    </div>
  );
}

function LedgerRow({ label, value, icon: Icon, isAlert, onAdd }: any) {
  return (
    <div className="group/row flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-all outline outline-1 outline-transparent hover:outline-white/10">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 group-hover/row:text-slate-300 transition-colors">
           <Icon className="w-4 h-4" />
        </div>
        <p className="text-sm font-semibold text-slate-300 group-hover/row:text-white transition-colors tracking-tight">{label}</p>
      </div>

      <div className="flex items-center gap-3">
         <span className={`text-base font-bold ${isAlert ? "text-slate-200" : "text-white"}`}>
            ₹{value.toLocaleString('en-IN')}
         </span>
         {onAdd && (
            <button
               onClick={onAdd}
               className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all opacity-0 group-hover/row:opacity-100 scale-90 group-hover/row:scale-100"
            >
               <Plus className="w-4 h-4" />
            </button>
         )}
      </div>
    </div>
  );
}

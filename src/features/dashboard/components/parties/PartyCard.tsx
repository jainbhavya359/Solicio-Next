"use client";

import { motion } from "framer-motion";
import { User, Building2, Phone, Mail, Hash, MapPin, Calendar, TrendingUp, TrendingDown, History, Edit2, FileText, ArrowRight } from "lucide-react";

interface Props {
  party: any;
  onEdit: (party: any) => void;
  onPay: (party: any) => void;
  onHistory: (party: any) => void;
}

const getCreditStatus = (lastTxDate: string | Date | undefined, terms: string | undefined, totalAmount: number) => {
    if (!terms || terms === "Immediate" || terms === "Standard Terms" || totalAmount === 0 || !lastTxDate) {
        return null;
    }

    const match = terms.match(/Net (\d+)/);
    if (!match) return null;

    const creditDays = parseInt(match[1]);
    const txDate = new Date(lastTxDate);
    const dueDate = new Date(txDate.getTime() + creditDays * 24 * 60 * 60 * 1000);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { overdue: true, text: `${Math.abs(diffDays)} Days Overdue`, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    } else if (diffDays === 0) {
        return { overdue: false, text: `Due Today`, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    } else {
        return { overdue: false, text: `${diffDays} Days Left`, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    }
};

export default function PartyCard({ party, onEdit, onPay, onHistory }: Props) {
  const isCompany = party.category === 'Company';
  const isCustomer = party.type === 'Customer';
  
  const toTake = (party.totalSales || 0) - (party.totalReceived || 0);
  const toGive = (party.totalPurchases || 0) - (party.totalPaid || 0);
  const netBalance = toTake - toGive;

  const status = getCreditStatus(
     party.lastTransactionDate, 
     party.paymentTerms, 
     isCustomer ? party.totalSales : party.totalPurchases
  );

  const baseHue = isCustomer ? "emerald" : "rose";
  const glowBorder = status?.overdue ? "border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.1)]" : "border-white/5";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className={`group bg-[#050505] rounded-[2rem] p-6 border ${glowBorder} hover:border-${baseHue}-500/30 transition-all duration-300 relative overflow-hidden flex flex-col`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${baseHue}-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700 blur-2xl`} />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isCompany ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
              {isCompany ? <Building2 className="w-6 h-6" /> : <User className="w-6 h-6" />}
           </div>
           <div>
              <h3 className="text-lg font-bold text-white leading-tight capitalize">{party.name}</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                 {party.category} <span className="mx-1">•</span> <span className={`text-${baseHue}-400`}>{party.type}</span>
              </p>
           </div>
        </div>
      </div>

      {/* Corporate Metadata Arrays */}
      <div className="relative z-10 space-y-3 flex-1 mb-6">
         {party.phone && (
            <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
               <Phone className="w-3.5 h-3.5 text-slate-500" />
               <span className="truncate">{party.phone}</span>
            </div>
         )}
         {party.emailAddress && (
            <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
               <Mail className="w-3.5 h-3.5 text-slate-500" />
               <span className="truncate">{party.emailAddress}</span>
            </div>
         )}
         {party.gstin && (
            <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
               <Hash className="w-3.5 h-3.5 text-slate-500" />
               <span className="uppercase tracking-widest">{party.gstin}</span>
            </div>
         )}
         
         <div className="pt-2 flex items-center gap-2">
            {status ? (
               <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                  <Calendar className="w-3 h-3" />
                  {status.text}
               </div>
            ) : (
               <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Settled / Immediate
               </div>
            )}
            
            {party.paymentTerms && party.paymentTerms !== "Standard Terms" && (
               <span className="text-[10px] font-bold text-slate-500 border border-white/5 px-2 py-1 rounded-md">
                 ({party.paymentTerms})
               </span>
            )}
         </div>
      </div>

      {/* Financial Matrix Footer */}
      <div className="relative z-10 mt-auto pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
         <div>
            <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
               <TrendingUp className="w-3 h-3 text-emerald-500" /> Receivables
            </p>
            <p className="text-lg font-black text-white tracking-tight">₹{Number(toTake).toLocaleString('en-IN')}</p>
         </div>
         <div>
            <p className="flex items-center justify-end gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 text-right">
               Liabilities <TrendingDown className="w-3 h-3 text-rose-500" />
            </p>
            <p className="text-lg font-black text-white tracking-tight text-right">₹{Number(toGive).toLocaleString('en-IN')}</p>
         </div>
      </div>

      {/* Interactive Command Hover Overlay */}
      <div className="absolute inset-0 bg-[#050505]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-[2px] z-20">
         <div className="flex items-center gap-3 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
             
             {/* Edit */}
             <button
                 onClick={(e) => { e.stopPropagation(); onEdit(party); }}
                 className="flex flex-col items-center justify-center gap-1.5 w-[72px] h-[72px] bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
             >
                 <Edit2 className="w-5 h-5 mb-1 text-slate-500" /> Edit
             </button>

             {/* Ledger */}
             <button
                 onClick={(e) => { e.stopPropagation(); onHistory(party); }}
                 className="flex flex-col items-center justify-center gap-1.5 w-[72px] h-[72px] bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
             >
                 <History className="w-5 h-5 mb-1 text-indigo-400" /> Ledger
             </button>

             {/* Pay/Settle */}
             <button
                 onClick={(e) => { e.stopPropagation(); onPay(party); }}
                 className={`flex flex-col items-center justify-center gap-1.5 w-[72px] h-[72px] bg-${baseHue}-500/20 hover:bg-${baseHue}-500/40 rounded-2xl border border-${baseHue}-500/30 text-[10px] font-bold uppercase tracking-widest text-${baseHue}-400 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.5)]`}
             >
                 <FileText className="w-5 h-5 mb-1" /> Settle
             </button>

         </div>
      </div>
      
    </motion.div>
  );
}

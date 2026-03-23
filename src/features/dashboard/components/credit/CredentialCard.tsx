"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Calendar, Building, Trash2, AlertTriangle, FileText } from "lucide-react";

interface Props {
  license: any;
  onDelete: (id: string) => void;
}

export default function CredentialCard({ license, onDelete }: Props) {
  const expiry = new Date(license.expiryDate || license.date);
  const today = new Date();
  const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);

  const isExpired = daysLeft <= 0;
  const isWarning = daysLeft > 0 && daysLeft <= 30;
  const baseColor = isExpired ? "rose" : isWarning ? "amber" : "emerald";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className={`group bg-[#050505] rounded-[2rem] border border-white/5 p-6 hover:border-${baseColor}-500/30 transition-all duration-300 flex flex-col relative overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${baseColor}-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-500 blur-2xl`} />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
         <div className="flex items-center gap-3">
             <div className={`p-2.5 rounded-xl bg-white/5 text-white group-hover:bg-${baseColor}-500/20 group-hover:text-${baseColor}-500 transition-colors border border-white/10`}>
                <FileText size={18} />
             </div>
             <div>
                <p className="font-bold text-white tracking-tight leading-tight">
                  {license.licenseName || license.licName}
                </p>
                <p className={`text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-1.5`}>
                   <Building size={10} className={`text-${baseColor}-500`} />
                   {license.issuingAuthority || license.authority}
                </p>
             </div>
         </div>
      </div>

      {/* Attributes */}
      <div className="space-y-4 mb-6 relative z-10">
         <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors border border-white/5">
             <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-500" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Expiration</p>
             </div>
             <p className="text-sm font-bold text-white">
                {expiry.toISOString().split("T")[0]}
             </p>
         </div>

         {/* Urgency Badge (Only shows if < 30 days) */}
         {(isExpired || isWarning) && (
            <div className={`flex items-center gap-3 p-3 rounded-xl border bg-${baseColor}-500/10 border-${baseColor}-500/30 transition-all`}>
               <div className={`h-8 w-8 rounded-lg bg-${baseColor}-500/20 flex items-center justify-center shrink-0`}>
                  <AlertTriangle size={16} className={`text-${baseColor}-400`} />
               </div>
               <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest leading-none text-${baseColor}-500/70`}>Compliance Status</p>
                  <p className={`text-xs font-bold mt-1 text-${baseColor}-400`}>
                     {isExpired ? "License Expired" : `${daysLeft} days remaining`}
                  </p>
               </div>
            </div>
         )}
      </div>

      {/* Footer Controls */}
      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
         <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-${baseColor}-500/10 text-[10px] font-bold text-${baseColor}-400 border border-${baseColor}-500/20 uppercase tracking-widest`}>
            <ShieldCheck size={12} />
            {isExpired ? "Lapsed" : isWarning ? "At Risk" : "Verified Safe"}
         </div>
         <button
            onClick={() => onDelete(license._id)}
            className="p-2 rounded-xl text-slate-500 hover:bg-rose-500/20 hover:text-rose-400 transition-all opacity-0 group-hover:opacity-100 hover:border hover:border-rose-500/30"
            title="Purge License Record"
         >
            <Trash2 size={16} />
         </button>
      </div>
    </motion.div>
  );
}

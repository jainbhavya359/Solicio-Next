import { motion } from "framer-motion";
import { ShieldCheck, Calendar, Building, Trash2, AlertTriangle, FileText } from "lucide-react";
import { LicenseStatusBadge } from "./LicenseStatusBadge";

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }
  },
} as any;

export function LicenseCard({ license, onDelete }: any) {
  const expiry = new Date(license.expiryDate || license.date);
  const today = new Date();

  const daysLeft = Math.ceil(
    (expiry.getTime() - today.getTime()) / 86400000
  );

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col relative overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            <FileText size={18} />
          </div>
          <div>
            <p className="font-black text-slate-900 leading-none tracking-tight">
              {license.licenseName || license.licName}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
              <Building size={10} className="text-emerald-500" />
              {license.issuingAuthority || license.authority}
            </p>
          </div>
        </div>
        <LicenseStatusBadge daysLeft={daysLeft} />
      </div>

      {/* Info Rows */}
      <div className="space-y-4 mb-6 relative z-10">
        <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 group-hover:bg-emerald-50/30 transition-colors">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiration</p>
          </div>
          <p className="text-xs font-bold text-slate-900">
            {expiry.toISOString().split("T")[0]}
          </p>
        </div>

        {/* Urgency Warning */}
        {daysLeft <= 30 && (
          <div
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${daysLeft <= 0
              ? "bg-rose-50 text-rose-600 border-rose-100"
              : "bg-amber-50 text-amber-600 border-amber-100"
              }`}
          >
            <div className="h-8 w-8 rounded-lg bg-white/50 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest leading-none">Compliance Status</p>
              <p className="text-xs font-bold mt-1">
                {daysLeft <= 0 ? "License Expired" : `${daysLeft} days remaining`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-[10px] font-bold text-slate-500">
          <ShieldCheck size={12} className="text-emerald-500" />
          Verified
        </div>
        <button
          onClick={() => onDelete(license._id)}
          className="p-2 rounded-xl text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
          title="Remove license"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}

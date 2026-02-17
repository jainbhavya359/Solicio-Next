"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ChevronRight, Zap, Target, ScrollText, Calendar, Building } from "lucide-react";

export function AddLicenseCard({ email }: any) {
  const [form, setForm] = useState({
    licenseName: "",
    licenseCategory: "Business",
    issuingAuthority: "",
    issueDate: "",
    expiryDate: "",
  });

  const submit = async () => {
    try {
      if (!form.licenseName || !form.issuingAuthority) {
        toast.error("Structural integrity failure: Missing required fields");
        return;
      }

      await axios.post("/api/licenses", {
        email,
        ...form,
      });

      toast.success("Credential synchronization successful");
      setForm({
        licenseName: "",
        licenseCategory: "Business",
        issuingAuthority: "",
        issueDate: "",
        expiryDate: "",
      });
    } catch {
      toast.error("Failed to synchronize credential entry");
    }
  };

  const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] px-1";
  const inputClass = "w-full mt-2 px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 shadow-sm";

  return (
    <div className="space-y-10 text-left">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-lg">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tightest">
            Add New <span className="text-emerald-600">Credential</span>
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Initialize Operational License</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <div className="group">
            <label className={labelClass}>License Identifier</label>
            <div className="relative">
              <ScrollText className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input
                placeholder="e.g. GST Registration Matrix"
                value={form.licenseName}
                onChange={(e) =>
                  setForm({ ...form, licenseName: e.target.value })
                }
                className={`${inputClass} pl-12`}
              />
            </div>
          </div>

          <div className="group">
            <label className={labelClass}>Issuing Authority</label>
            <div className="relative">
              <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input
                placeholder="e.g. Federal Governance Board"
                value={form.issuingAuthority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    issuingAuthority: e.target.value,
                  })
                }
                className={`${inputClass} pl-12`}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="group">
            <label className={labelClass}>Activation Date</label>
            <div className="relative">
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="date"
                value={form.issueDate}
                onChange={(e) =>
                  setForm({ ...form, issueDate: e.target.value })
                }
                className={`${inputClass} pl-12`}
              />
            </div>
          </div>

          <div className="group">
            <label className={labelClass}>Expiration Horizon</label>
            <div className="relative">
              <Target className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) =>
                  setForm({ ...form, expiryDate: e.target.value })
                }
                className={`${inputClass} pl-12`}
              />
            </div>
          </div>
        </div>

        <button
          onClick={submit}
          className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-900/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 mt-4"
        >
          Synchronize Credential <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

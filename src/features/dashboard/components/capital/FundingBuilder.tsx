"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CreditCard, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

interface FundingBuilderProps {
  loanType: string; setLoanType: (v: string) => void;
  lender: string; setLender: (v: string) => void;
  principal: number | ""; setPrincipal: (v: number | "") => void;
  interestRate: number | ""; setInterestRate: (v: number | "") => void;
  tenure: number | ""; setTenure: (v: number | "") => void;
  tenureUnit: string; setTenureUnit: (v: string) => void;
  startDate: string; setStartDate: (v: string) => void;
}

const formatIndianNumber = (value: string | number) => {
  if (value === null || value === undefined || value === "") return "";
  const strValue = value.toString();
  const parts = strValue.split(".");
  if (parts[0] && parts[0] !== "-") {
    parts[0] = Number(parts[0]).toLocaleString('en-IN');
  }
  return parts.join(".");
};

export default function FundingBuilder({
  loanType, setLoanType,
  lender, setLender,
  principal, setPrincipal,
  interestRate, setInterestRate,
  tenure, setTenure,
  tenureUnit, setTenureUnit,
  startDate, setStartDate
}: FundingBuilderProps) {
  
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (/^\d*\.?\d*$/.test(raw)) setPrincipal(raw ? Number(raw) : "");
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (/^\d*\.?\d*$/.test(raw)) setInterestRate(raw ? Number(raw) : "");
  };

  const handleTenureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(raw)) setTenure(raw ? Number(raw) : "");
  };

  const labelClass = "text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2";
  const inputClass = "w-full px-5 py-4 rounded-2xl border border-white/10 bg-[#0a0a0a] text-slate-200 text-lg font-bold placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]";

  const nextStep = () => setStep((p) => Math.min(p + 1, totalSteps));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  return (
    <div className="w-full relative overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-start mb-10 w-full">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tightest">
              Funding <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Builder</span>
            </h2>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="hidden sm:flex items-center gap-1.5 mt-2">
           {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-500 ${s === step ? 'w-10 bg-emerald-500' : s < step ? 'w-4 bg-emerald-500/40' : 'w-4 bg-white/10'}`} 
              />
           ))}
        </div>
      </div>

      <div className="relative flex-grow min-h-[220px]">
         <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                 <div>
                   <label className={labelClass}>Capital Purpose</label>
                   <div className="grid grid-cols-2 gap-3 mb-4">
                      {["Inventory Scaling", "Equipment Purchase", "Working Capital", "Expansion"].map((purpose) => (
                         <button 
                           key={purpose} 
                           onClick={() => setLoanType(purpose)}
                           className={`p-3 text-left text-xs font-bold rounded-xl border transition-all ${loanType === purpose ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'bg-[#0a0a0a] border-white/10 text-slate-400 hover:border-white/20'}`}
                         >
                           {purpose}
                         </button>
                      ))}
                   </div>
                   <input value={loanType} onChange={(e) => setLoanType(e.target.value)} placeholder="Or type a custom purpose..." className={inputClass} maxLength={30} />
                 </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                 <div>
                   <label className={labelClass}>Lending Institution / Framework</label>
                   <input value={lender} onChange={(e) => setLender(e.target.value)} placeholder="e.g., Commercial Bank, Mudra" className={inputClass} maxLength={30} />
                 </div>
                 <div>
                   <label className={labelClass}>Interest Formula (% p.a.)</label>
                   <input type="text" value={interestRate} onChange={handleInterestRateChange} className={inputClass} placeholder="e.g. 12" />
                 </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                 <div>
                   <label className={labelClass}>Principal Amount (₹)</label>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-emerald-500 font-bold text-lg">₹</div>
                     <input type="text" value={formatIndianNumber(principal)} onChange={handlePrincipalChange} className={`${inputClass} pl-10`} placeholder="5,00,000" />
                   </div>
                 </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                 <div className="grid grid-cols-[2fr_1fr] gap-4">
                   <div>
                     <label className={labelClass}>Time Horizon</label>
                     <input type="text" value={tenure} onChange={handleTenureChange} className={inputClass} placeholder="e.g. 12" />
                   </div>
                   <div>
                     <label className={labelClass}>Unit</label>
                     <select value={tenureUnit} onChange={(e) => setTenureUnit(e.target.value)} className={`${inputClass} appearance-none cursor-pointer px-4`}>
                       <option value="months">Months</option>
                       <option value="years">Years</option>
                     </select>
                   </div>
                 </div>
                 <div>
                   <label className={labelClass}>Activation Date</label>
                   <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} style={{ colorScheme: 'dark' }} />
                 </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
         <button 
           onClick={prevStep} 
           disabled={step === 1}
           className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors flex items-center gap-2"
         >
           <ArrowLeft className="w-4 h-4" /> Back
         </button>
         
         <button 
           onClick={nextStep} 
           disabled={step === totalSteps}
           className="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-emerald-950 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-0 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
         >
           Next <ArrowRight className="w-4 h-4" />
         </button>
      </div>

    </div>
  );
}

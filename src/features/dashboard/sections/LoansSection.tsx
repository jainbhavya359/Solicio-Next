"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { ShieldAlert, CreditCard } from "lucide-react";

import { Loan } from "../../loan_licenses/ActiveLoans";

// Feature Components
import CreditSummaryHero from "../components/credit/CreditSummaryHero";
import LiabilityAlertStrip from "../components/credit/LiabilityAlertStrip";
import CreditFacilityCard from "../components/credit/CreditFacilityCard";
import CreditInsightPanel from "../components/credit/CreditInsightPanel";
import ComplianceOverview from "../components/credit/ComplianceOverview";
import CreditActionFooter from "../components/credit/CreditActionFooter";

interface Props {
  loans: Loan[];
  loadingLoans: boolean;
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function LoansSection({ loans, loadingLoans, setLoans }: Props) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  // Internal License State originally abstracted inside License_Report
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loadingLicenses, setLoadingLicenses] = useState(true);

  const fetchLicenses = async () => {
    if (!email) return;
    try {
       const res = await axios.get(`/api/licenses?email=${email}`);
       setLicenses(res.data);
    } catch (err) {
       console.error("Failed to fetch operational credentials:", err);
    } finally {
       setLoadingLicenses(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  // Handlers
  const handleDeleteLoan = async (loanId: string) => {
    const ok = confirm("Are you sure you want to terminate this credit facility?");
    if (!ok) return;
    try {
        await fetch(`/api/loans?id=${loanId}`, { method: "DELETE" });
        setLoans((prev) => prev.filter((l) => l._id !== loanId));
    } catch (error) {
        console.error("Failed to delete loan", error);
    }
  };

  const handleDeleteLicense = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this operational credential?");
    if (!ok) return;
    try {
      await axios.delete(`/api/licenses?id=${id}`);
      fetchLicenses();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] w-full mx-auto relative z-10 w-full mb-10 overflow-x-hidden">
        
       {/* High-level Debt & Risk Synthesis */}
       <CreditSummaryHero loans={loans} />

       {/* Intercepts both datasets to render severity alerts unconditionally */}
       <LiabilityAlertStrip loans={loans} licenses={licenses} />

       {/* Credit Facility Tracking Network */}
       <section className="mt-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-sm border border-emerald-500/20">
               <CreditCard className="h-7 w-7" />
            </div>
            <div>
               <h2 className="text-3xl font-black text-white leading-tight tracking-tight">Active Facilities</h2>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                  Revolving Credit & Hard Debt Tracking
               </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loadingLoans ? (
                <div className="bg-[#050505] rounded-[2rem] border border-white/5 p-24 shadow-sm flex flex-col items-center justify-center">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                        <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="mt-8 text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Mapping Debt Instruments...</p>
                </div>
            ) : loans.length === 0 ? (
                <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#050505] rounded-[2rem] border border-white/5 p-20 shadow-sm text-center flex flex-col items-center"
                >
                    <div className="w-20 h-20 rounded-[2.5rem] bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                        <ShieldAlert size={40} />
                    </div>
                    <p className="text-white font-black text-xl tracking-tight">Zero Corporate Debt Identified</p>
                    <p className="text-sm text-slate-500 mt-2 max-w-xs font-medium">Your credit profile indicates 100% self-sustained capitalization.</p>
                </motion.div>
            ) : (
                <motion.div
                    key="list"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {loans.map((loan) => (
                       <CreditFacilityCard key={loan._id} loan={loan} onDelete={handleDeleteLoan} />
                    ))}
                </motion.div>
            )}
          </AnimatePresence>
       </section>

       {/* Heuristic Liability Text Generator */}
       <div className="mt-6">
          <CreditInsightPanel loans={loans} />
       </div>

       {/* Sub-system Compliance Interceptor */}
       <ComplianceOverview licenses={licenses} loading={loadingLicenses} onDelete={handleDeleteLicense} />

       {/* Final Execution CTAs */}
       <CreditActionFooter />
    </div>
  );
}

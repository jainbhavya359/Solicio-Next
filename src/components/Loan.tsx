"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { useCreditStore } from "../store/useCreditStore";
import { calculateEMI } from "../utils/emiCal";

import CapitalHero from "../features/dashboard/components/capital/CapitalHero";
import CreditHealthPanel from "../features/dashboard/components/capital/CreditHealthPanel";
import SimulatorEngine from "../features/dashboard/components/capital/SimulatorEngine";
import OutcomePanel from "../features/dashboard/components/capital/OutcomePanel";
import FundingBuilder from "../features/dashboard/components/capital/FundingBuilder";
import SmartCalculationPanel from "../features/dashboard/components/capital/SmartCalculationPanel";
import SmartCapitalSources from "../features/dashboard/components/capital/SmartCapitalSources";
import AIInsightsSection from "../features/dashboard/components/capital/AIInsightsSection";
import CapitalCTASection from "../features/dashboard/components/capital/CapitalCTASection";

export default function Loan() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const name = user?.fullName;

  // Simulator State
  const [paymentHistory, setPaymentHistory] = useState(95);
  const [ratio, setRatio] = useState(30);
  const [year, setYear] = useState(5);
  const [inquiries, setInquiries] = useState(2);
  const { score, index, show, setScore, setIndex, showResult } = useCreditStore();

  const calculateScore = () => {
    const paymentFactor = (paymentHistory / 100) * 35;
    const utilizationFactor = (1 - ratio / 100) * 30;
    const historyFactor = Math.min(year / 20, 1) * 15;
    const inquiryFactor = Math.max(1 - inquiries / 10, 0) * 20;

    const rawScore = paymentFactor + utilizationFactor + historyFactor + inquiryFactor;
    const finalScore = Math.round(300 + rawScore * 5.5);

    let idx = 0;
    if (finalScore >= 750) idx = 4;
    else if (finalScore >= 700) idx = 3;
    else if (finalScore >= 650) idx = 2;
    else if (finalScore >= 600) idx = 1;

    setIndex(idx);
    setScore(Math.min(Math.max(finalScore, 300), 850));
    showResult(true);
  };

  // Funding Builder State
  const [loanType, setLoanType] = useState("");
  const [lender, setLender] = useState("");
  const [principal, setPrincipal] = useState<number | "">("");
  const [interestRate, setInterestRate] = useState<number | "">("");
  const [tenure, setTenure] = useState<number | "">("");
  const [tenureUnit, setTenureUnit] = useState("months");
  const [startDate, setStartDate] = useState("");
  const [loadingLoan, setLoadingLoan] = useState(false);

  // EMI Calculation Hook
  const tenureMonths = tenureUnit === "years" ? Number(tenure) * 12 : Number(tenure);
  const emi = calculateEMI({
    principal: Number(principal),
    annualRate: Number(interestRate),
    tenureMonths,
  });

  const submitLoan = async () => {
    try {
      setLoadingLoan(true);
      await axios.post("/api/loans", {
        email, name, loanType, lender, principalAmount: principal,
        interestRate, tenure, tenureUnit, repaymentFrequency: "monthly",
        loanStartDate: startDate, firstEmIDate: startDate,
      });
      toast.success("Capital allocation synchronized successfully");
      
      // Reset form
      setLoanType(""); setLender(""); setPrincipal("");
      setInterestRate(""); setTenure(""); setStartDate("");
    } catch {
      toast.error("Failed to execute capital deployment");
    } finally {
      setLoadingLoan(false);
    }
  };

  const getTierName = (idx: number) => ["Poor", "Fair", "Good", "Very Good", "Excellent"][idx] || "Unrated";

  return (
    <section className="bg-[#020202] min-h-screen relative overflow-hidden flex flex-col items-center font-outfit text-slate-200">
      
      {/* Dark Mode Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#020202] to-[#020202]"></div>
        <div className="absolute inset-0 opacity-[0.2] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <Toaster />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-12 sm:pb-24 space-y-24">
        
        {/* HERO & GLOBAL HEALTH */}
        <div className="space-y-12">
          <CapitalHero />
          <CreditHealthPanel score={score} tier={getTierName(index)} tierIndex={index} />
        </div>

        {/* NEURAL SIMULATOR vs OUTCOME PANEL */}
        <div className="w-full bg-[#050505]/80 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-6 sm:p-12 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-start align-top">
            <SimulatorEngine 
              paymentHistory={paymentHistory} setPaymentHistory={setPaymentHistory}
              ratio={ratio} setRatio={setRatio}
              year={year} setYear={setYear}
              inquiries={inquiries} setInquiries={setInquiries}
              calculateScore={calculateScore}
            />
            <div className="h-full flex flex-col">
              <OutcomePanel show={show} score={score} tierIndex={index} />
            </div>
          </div>
        </div>

        {/* CAPITAL DEPLOYMENT BUILDER */}
        <div className="w-full bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 p-6 sm:p-12 shadow-2xl">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 sm:gap-20 items-start">
            <FundingBuilder
              loanType={loanType} setLoanType={setLoanType}
              lender={lender} setLender={setLender}
              principal={principal} setPrincipal={setPrincipal}
              interestRate={interestRate} setInterestRate={setInterestRate}
              tenure={tenure} setTenure={setTenure}
              tenureUnit={tenureUnit} setTenureUnit={setTenureUnit}
              startDate={startDate} setStartDate={setStartDate}
            />
            <div className="h-full flex flex-col justify-end">
              <SmartCalculationPanel 
                emi={emi.emi} 
                totalInterest={emi.totalInterest} 
                totalPayable={emi.totalPayable} 
                submitLoan={submitLoan} 
                loading={loadingLoan}
              />
            </div>
          </div>
        </div>

        {/* INSTITUTIONAL CAPITAL (GOV RESOURCES) */}
        <SmartCapitalSources />

        {/* AI INSIGHTS */}
        <AIInsightsSection />

        {/* CTA BANNER */}
        <CapitalCTASection />

        {/* FOOTER STRIP */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Capital Intelligence Protocol Secure</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Solicio Financial Core v3.0</p>
        </div>

      </div>
    </section>
  );
}

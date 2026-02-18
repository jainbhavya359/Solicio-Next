"use client";

import { useState, useEffect } from "react";
import { animate, motion, useMotionValue, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CreditCard, TrendingUp, Activity, ShieldCheck, HelpCircle, ExternalLink, Calculator, ChevronRight, Zap, Target } from "lucide-react";
import { useCreditStore } from "../store/useCreditStore";
import { scores_rate } from "../utils/store";
import { calculateEMI } from "../utils/emiCal";

/* -------------------------------------------------------------------------- */
/*                              Animated Score                                */
/* -------------------------------------------------------------------------- */

function AnimatedScore({ value, className = "" }: { value: number; className?: string }) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.5,
      ease: [0.23, 1, 0.32, 1],
    });

    const unsub = motionValue.on("change", (v) =>
      setDisplay(Math.round(v))
    );

    return () => {
      controls.stop();
      unsub();
    };
  }, [value]);

  return (
    <span className={`text-6xl font-extrabold tracking-tightest ${className}`}>
      {display}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Credit Gauge                                 */
/* -------------------------------------------------------------------------- */

export function CreditGauge({ score }: { score: number }) {
  const min = 300;
  const max = 850;
  const radius = 90;
  const stroke = 12;
  const circumference = Math.PI * radius;

  const isUnrated = !score || score === 0;
  const validScore = Math.max(min, Math.min(score, max));
  const progress = isUnrated ? 0 : (validScore - min) / (max - min);
  const dashOffset = circumference * (1 - progress);

  const getScoreDetails = () => {
    if (isUnrated) return { label: "Unrated", color: "#94a3b8", text: "text-slate-400", bg: "bg-slate-100", feedback: "Start building your credit history to unlock growth capital." };
    if (score < 600) return { label: "Needs Work", color: "#dc2626", text: "text-rose-600", bg: "bg-rose-50", feedback: "High risk profile. Focus on stabilizing debt obligations." };
    if (score < 700) return { label: "Fair", color: "#d97706", text: "text-amber-600", bg: "bg-amber-50", feedback: "Balanced profile. Opportunities for improvement exist." };
    if (score < 750) return { label: "Good", color: "#0891b2", text: "text-cyan-600", bg: "bg-cyan-50", feedback: "Solid capital health. You qualify for standard rates." };
    return { label: "Excellent", color: "#16a34a", text: "text-emerald-600", bg: "bg-emerald-50", feedback: "Optimal credit strength. Primed for maximum leverage." };
  };

  const { label, color, text, bg, feedback } = getScoreDetails();

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl shadow-slate-200/50 flex flex-col items-center relative overflow-hidden group">

      {/* Visual Accents */}
      <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700 ${bg}`}></div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="flex items-center gap-4 mb-2 self-start w-full">
          <div className={`p-3 rounded-2xl ${bg} ${text} shadow-inner`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Neural Credit Score</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Experian Intelligence Protocol</p>
          </div>
        </div>

        <div className="relative mt-12 flex flex-col items-center">
          <svg viewBox="0 0 220 120" className="w-80 drop-shadow-xl">
            <path
              d="M20 110 A90 90 0 0 1 200 110"
              fill="none"
              stroke="#f8fafc"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <motion.path
              d="M20 110 A90 90 0 0 1 200 110"
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
            />
          </svg>

          <div className="absolute inset-0 top-12 flex flex-col items-center justify-center">
            {isUnrated ? (
              <span className="text-6xl font-extrabold tracking-tightest text-slate-200">---</span>
            ) : (
              <AnimatedScore value={score} className={text} />
            )}
            <div className={`mt-2 px-3 py-1 rounded-full ${bg} ${text} text-[10px] font-bold uppercase tracking-widest border border-current opacity-70`}>
              {label}
            </div>
          </div>
        </div>

        <div className="flex justify-between w-72 mt-2 text-[10px] font-black text-slate-300 px-2 uppercase tracking-widest">
          <span>Min 300</span>
          <span>Max 850</span>
        </div>

        <div className="mt-12 w-full p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-start gap-4 ring-1 ring-inset ring-slate-100/50">
          <ShieldCheck className={`w-5 h-5 mt-0.5 ${text}`} />
          <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
            "{feedback}"
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Add Loan Card                                */
/* -------------------------------------------------------------------------- */

function AddLoanCard({ email, name }: any) {
  const [loanType, setLoanType] = useState("");
  const [lender, setLender] = useState("");
  const [principal, setPrincipal] = useState<number | "">("");
  const [interestRate, setInterestRate] = useState<number>(12);
  const [tenure, setTenure] = useState<number>(12);
  const [tenureUnit, setTenureUnit] = useState("months");
  const [startDate, setStartDate] = useState("");

  const tenureMonths = tenureUnit === "years" ? tenure * 12 : tenure;
  const emi = calculateEMI({
    principal: Number(principal),
    annualRate: Number(interestRate),
    tenureMonths,
  });

  const submitLoan = async () => {
    try {
      await axios.post("/api/loans", {
        email, name, loanType, lender, principalAmount: principal,
        interestRate, tenure, tenureUnit, repaymentFrequency: "monthly",
        loanStartDate: startDate, firstEmIDate: startDate,
      });
      toast.success("Capital allocation synchronized successfully");
    } catch {
      toast.error("Failed to commit capital entry");
    }
  };

  const labelClass = "text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] px-1";
  const inputClass = "w-full mt-1.5 sm:mt-2 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm sm:text-base font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 shadow-sm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl sm:rounded-[2.5rem] border border-slate-100 p-4 sm:p-10 shadow-sm sm:shadow-2xl shadow-slate-200/50 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none hidden sm:block">
        <CreditCard className="w-48 h-48 rotate-12" />
      </div>

      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
        <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tightest">New <span className="text-emerald-600">Capital Deployment</span></h2>
          <p className="text-[10px] sm:text-sm font-bold uppercase tracking-widest text-slate-400 mt-0.5 sm:mt-1">Operational Funding Request</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-left">
          <div>
            <label className={labelClass}>Capital Purpose</label>
            <input value={loanType} onChange={(e) => setLoanType(e.target.value)} placeholder="e.g., Inventory Scaling" className={inputClass} maxLength={20} />
          </div>
          <div>
            <label className={labelClass}>Lending Institution</label>
            <input value={lender} onChange={(e) => setLender(e.target.value)} placeholder="e.g., Commercial Bank" className={inputClass} maxLength={30} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 text-left">
          <div>
            <label className={labelClass}>Principal Amount (₹)</label>
            <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value === "" ? "" : +e.target.value)} className={inputClass} min={0} />
          </div>
          <div>
            <label className={labelClass}>Interest Formula (% p.a.)</label>
            <input type="number" value={interestRate} onChange={(e) => setInterestRate(+e.target.value)} className={inputClass} min={0} max={100} step={0.1} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-8 text-left">
          <div className="col-span-2">
            <label className={labelClass}>Time Horizon</label>
            <input type="number" value={tenure} onChange={(e) => setTenure(+e.target.value)} className={inputClass} min={1} />
          </div>
          <div>
            <label className={labelClass}>Temporal Unit</label>
            <select value={tenureUnit} onChange={(e) => setTenureUnit(e.target.value)} className={inputClass}>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
        </div>

        <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-900 text-white shadow-xl sm:shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400 mb-1 sm:mb-2">Tactical Projection</p>
              <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-60">Estimated Monthly Obligation</h3>
            </div>
            {emi.emi > 0 ? (
              <div className="text-center md:text-right">
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tightest">
                  ₹{emi.emi.toLocaleString()}
                </p>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-2 md:justify-end opacity-60">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Int: ₹{emi.totalInterest.toLocaleString()}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">Total: ₹{emi.totalPayable.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-sm font-bold text-slate-400 normal-case italic">Awaiting structural configuration...</p>
            )}
          </div>
        </div>

        <div className="text-left">
          <label className={labelClass}>Activation Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
        </div>

        <button
          onClick={submitLoan}
          className="w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-900/20 transition-all duration-300 active:scale-[0.99] flex items-center justify-center gap-3"
        >
          Synchronize Capital Desk <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   MAIN                                     */
/* -------------------------------------------------------------------------- */

export default function Loan() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const name = user?.fullName;

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

  return (
    <section className="bg-white min-h-screen relative overflow-hidden flex flex-col items-center font-outfit">
      {/* Background radial grid */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <Toaster />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-24 space-y-6 sm:space-y-24">

        {/* HERO HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest mb-4 sm:mb-6 border border-slate-200/50">
            <CreditCard className="w-3 h-3 text-emerald-600" />
            Neural Capital Deck
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tightest leading-none">
            Credit <span className="text-emerald-600">& Capital</span>
          </h1>
          <p className="mt-4 sm:mt-8 text-sm sm:text-xl md:text-2xl text-slate-500 leading-relaxed font-medium max-w-2xl">
            Leverage financial intelligence to optimize your business capital structure.
          </p>
        </motion.div>

        {/* TOP METRICS STRIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8">
          {[
            { label: "Neural Credit Rating", value: score || "--", color: "text-emerald-600", icon: <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
            { label: "Tier Classification", value: show ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][index] : "--", color: "text-slate-900", icon: <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
            { label: "Risk Exposure Level", value: show ? (index <= 1 ? "Critical" : index === 2 ? "Balanced" : "Minimal") : "--", color: index <= 1 ? "text-rose-600" : index === 2 ? "text-amber-600" : "text-emerald-600", icon: <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-100 rounded-xl sm:rounded-[2rem] p-4 sm:p-8 shadow-sm sm:shadow-xl shadow-slate-200/40 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500 hidden sm:block">
                {item.icon}
              </div>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1 sm:mb-3">{item.label}</p>
              <p className={`text-2xl sm:text-4xl font-extrabold tracking-tightest ${item.color}`}>{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* SIMULATOR & GAUGE SECTION */}
        <div className="grid lg:grid-cols-1 gap-6 sm:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl sm:rounded-[3rem] border border-slate-100 p-4 sm:p-12 shadow-sm sm:shadow-2xl shadow-slate-200/50"
          >
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-start">
              <div className="text-left space-y-6 sm:space-y-8">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tightest mb-2 sm:mb-4">Neural <span className="text-emerald-600">Simulator</span></h2>
                  <p className="text-sm sm:text-lg text-slate-500 font-medium">Calibrate your credit variables to project future capital accessibility.</p>
                </div>

                <div className="grid gap-6 sm:gap-8">
                  {[
                    { label: "Operational Payment Success (%)", value: paymentHistory, setter: setPaymentHistory, icon: <Zap /> },
                    { label: "Capital Utilization Ratio (%)", value: ratio, setter: setRatio, icon: <Activity /> },
                    { label: "Financial Tenure Depth (Years)", value: year, setter: setYear, icon: <TrendingUp /> },
                    { label: "Strategic Hard Inquiries", value: inquiries, setter: setInquiries, icon: <ShieldCheck /> },
                  ].map((field: any, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-center mb-2 sm:mb-3">
                        <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 max-w-[70%] leading-tight sm:max-w-none">{field.label}</label>
                        <span className="text-xs sm:text-sm font-black text-slate-900 group-focus-within:text-emerald-600 transition-colors">{field.value}</span>
                      </div>
                      <input
                        type="range"
                        value={field.value}
                        onChange={(e) => field.setter(+e.target.value)}
                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600 hover:accent-emerald-500 transition-all"
                        min={0}
                        max={i === 0 || i === 1 ? 100 : i === 2 ? 30 : 20}
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={calculateScore}
                  className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white bg-slate-900 hover:bg-slate-800 shadow-xl sm:shadow-2xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  Project Neural Score <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              <div className="h-full">
                <AnimatePresence mode="wait">
                  {show ? (
                    <motion.div
                      key="gauge"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="h-full flex flex-col justify-center"
                    >
                      <CreditGauge score={score} />
                      <div className="mt-8 p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-2">Simulation Result Card</p>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed text-center px-4">
                          {scores_rate[index]}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-full min-h-[400px] border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300 gap-4">
                      <Activity className="w-12 h-12 opacity-20" />
                      <p className="text-sm font-bold uppercase tracking-widest opacity-40">Awaiting Signal Input</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        <AddLoanCard email={email} name={name} />

        {/* GOV RESOURCES GRID */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap px-1">Institutional Capital Modules</span>
            <div className="h-px w-full bg-slate-100" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { title: "Pradhan Mantri Mudra Yojana", desc: "Growth-focused loans up to ₹10 lakh for MSME acceleration.", link: "https://www.mudra.org.in/" },
              { title: "CGTMSE Protocol", desc: "Collateral-free security architecture for credits up to ₹2 crore.", link: "https://www.cgtmse.in/" },
              { title: "SIDBI Direct Capital", desc: "High-tier institutional funding for MSME expansion & working capital.", link: "https://www.sidbi.in/" },
            ].map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-emerald-900/10 hover:border-emerald-200 transition-all duration-500 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
                    <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-4 tracking-tightest group-hover:text-emerald-600 transition-colors">{s.title}</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed font-medium">{s.desc}</p>
                </div>
                <a
                  href={s.link}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 group-hover:text-emerald-600 transition-all"
                >
                  Access Platform <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FOOTER STRIP */}
        <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Capital Protection Secure</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Solicio Financial Core v2.0</p>
        </div>

      </div>
    </section>
  );
}

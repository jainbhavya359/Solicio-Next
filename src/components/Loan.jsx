"use client"

import { useState, useEffect } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCreditStore } from "../store/useCreditStore";
import { scores_rate } from "../utils/store";
import { calculateEMI } from "../utils/emiCal";

function AnimatedScore({value}) {
  const score = useMotionValue(0);
  const [display, setDisplay] = useState(0);

   const getColor = () => {
    if (score < 600) return "#ef4444";
    if (score < 700) return "#f59e0b";
    return "#22c55e";
  };

  useEffect(() => {
    const controls = animate(score, value, {
      duration: 1.2,
      ease: "easeOut",
    });

    const unsubscribe = score.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, score]);

  return (
    <motion.span className="text-4xl font-extrabold">
      <div
          className="text-6xl font-extrabold tracking-tight"
          style={{ color: getColor() }}
        >
      {display}

        </div>
    </motion.span>
  );
}


export function CreditGauge({ score }) {
  const radius = 90;
  const stroke = 12; // slightly thinner
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const progress = Math.min(Math.max((score - 300) / 550, 0), 1);
  const halfCircumference = circumference / 2;
  const dashOffset = halfCircumference * (1 - progress);

  const getColor = () => {
    if (score < 600) return "#ef4444";
    if (score < 700) return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div className="flex flex-col items-center mt-10">
      {/* GAUGE */}
      <div className="relative w-80 h-32">
        <svg
          viewBox="0 0 220 220"
          className="absolute inset-0 rotate-180"
        >
          {/* Background arc */}
          <circle
            cx="110"
            cy="110"
            r={normalizedRadius}
            fill="transparent"
            stroke="#1f2937"
            strokeWidth={stroke}
            strokeDasharray={`${halfCircumference} ${circumference}`}
          />

          {/* Animated arc */}
          <motion.circle
            key={score}
            cx="110"
            cy="110"
            r={normalizedRadius}
            fill="transparent"
            stroke={getColor()}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${halfCircumference} ${circumference}`}
            initial={{ strokeDashoffset: halfCircumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 10px ${getColor()}66)`,
            }}
          />
        </svg>
      </div>

      {/* SCORE — COMPLETELY SEPARATE LAYER */}
      <div className="text-center -mt-2">
        <div
          className="text-6xl font-extrabold tracking-tight"
          style={{ color: getColor() }}
        >
          <AnimatedScore value={score} />
        </div>
        <div className="text-sm text-slate-400 mt-1">
          Credit Score
        </div>
      </div>

      {/* RANGE */}
      <div className="flex justify-between w-64 mt-2 text-xs text-slate-500">
        <span>300</span>
        <span>850</span>
      </div>
    </div>
  );
}

function AddLoanCard({ email, name }) {
  const [loanType, setLoanType] = useState("");
  const [lender, setLender] = useState("");
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(12);
  const [tenureUnit, setTenureUnit] = useState("months");
  const [repaymentFrequency, setRepaymentFrequency] =
    useState("monthly");
  const [startDate, setStartDate] = useState("");

  const tenureMonths =
    tenureUnit === "years" ? tenure * 12 : tenure;

  const emi = calculateEMI(principal, interestRate, tenureMonths);

  const submitLoan = async () => {
    try {
      await axios.post("/api/loans", {
        email,
        name,
        loanType,
        lender,
        principalAmount: principal,
        interestRate,
        tenure,
        tenureUnit,
        repaymentFrequency,
        loanStartDate: startDate,
        firstEmIDate: startDate,
      });

      toast.success("Loan added successfully");
    } catch {
      toast.error("Failed to add loan");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Add Loan
      </h2>

      {/* BASIC INFO */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Loan Type</label>
          <input
            placeholder="Business / Personal"
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
            className="loan-input"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Lender Name</label>
          <input
            placeholder="Bank / NBFC name"
            value={lender}
            onChange={(e) => setLender(e.target.value)}
            className="loan-input"
          />
        </div>
      </div>

      {/* FINANCIALS */}
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <div>
          <label className="text-sm text-slate-300">Loan Amount (₹)</label>
          <input
            type="number"
            min={0}
            placeholder="e.g. 500000"
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
            className="loan-input"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Interest Rate (% p.a.)</label>
          <input
            type="number"
            min={0}
            step="0.1"
            placeholder="e.g. 11.5"
            value={interestRate}
            onChange={(e) => setInterestRate(+e.target.value)}
            className="loan-input"
          />
        </div>
      </div>

      {/* TENURE */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="col-span-2">
          <label className="text-sm text-slate-300">Tenure</label>
          <input
            type="number"
            min={1}
            placeholder="e.g. 24"
            value={tenure}
            onChange={(e) => setTenure(+e.target.value)}
            className="loan-input"
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Unit</label>
          <select
            value={tenureUnit}
            onChange={(e) =>
              setTenureUnit(e.target.value)
            }
            className="loan-input"
          >
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
      </div>

      {/* EMI PREVIEW */}
      <div className="mt-6 rounded-2xl bg-black/40 border border-white/10 p-4">
        <p className="text-xs text-slate-400">Estimated EMI</p>

        {emi.emi > 0 ? (
          <>
            <p className="text-3xl font-bold text-emerald-400 mt-1">
              ₹{emi.emi.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Interest: ₹{emi.totalInterest.toLocaleString()} ·
              Total: ₹{emi.totalPayable.toLocaleString()}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-500 mt-2">
            Enter loan amount, interest rate and tenure to calculate EMI
          </p>
        )}
      </div>

      {/* START DATE */}
      <div className="mt-6">
        <label className="text-sm text-slate-300">Loan Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="loan-input"
        />
      </div>

      {/* CTA */}
      <button
        onClick={submitLoan}
        className="mt-8 w-full py-4 rounded-full font-bold text-black
        bg-gradient-to-r from-emerald-400 to-teal-400
        hover:opacity-90 transition"
      >
        Add Loan →
      </button>
    </motion.div>

  );
}


export default function Loan() {

  const { user } = useUser();
  const email = user?.primaryEmailAddress.emailAddress
  const name = user?.fullName;

  useEffect(() => {
      if(!email){
        return;
      }
  }, []);

  // /* Loan form */
  // const [loanName, setLoanName] = useState("");
  // const [lender, setLender] = useState("");
  // const [amount, setAmount] = useState(0);
  // const [panNum, setPanNum] = useState("");
  // const [date, setDate] = useState("");
  // const [tenure, setTenure] = useState("");

  /* Credit score */
  const [paymentHistory, setPaymentHistory] = useState(95);
  const [ratio, setRatio] = useState(30);
  const [year, setYear] = useState(5);
  const [inquiries, setInquiries] = useState(2);
  const { score, index, show, setScore, setIndex, showResult } = useCreditStore();

  

  const calculateScore = () => {
    const ph = Number(paymentHistory);
    const util = Number(ratio);
    const yrs = Number(year);
    const inq = Number(inquiries);

    // Normalize factors
    const paymentFactor = (ph / 100) * 35;
    const utilizationFactor = (1 - util / 100) * 30;
    const historyFactor = Math.min(yrs / 20, 1) * 15;
    const inquiryFactor = Math.max(1 - inq / 10, 0) * 20;

    const rawScore =
      paymentFactor +
      utilizationFactor +
      historyFactor +
      inquiryFactor;

    // Scale to credit score range
    const finalScore = Math.round(300 + rawScore * 5.5);

    let idx = 0;

    if (finalScore >= 750) idx = 4;
    else if (finalScore >= 700) idx = 3;
    else if (finalScore >= 650) idx = 2;
    else if (finalScore >= 600) idx = 1;
    else idx = 0;

    setIndex(idx);


    setScore(Math.min(Math.max(finalScore, 300), 850));
    showResult(true);
  };

  // const handleChange = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await axios.post(
  //       "/api/loans", JSON.stringify({
  //           loanName,
  //           lender,
  //           amount,
  //           panNum,
  //           date,
  //           name,
  //           email,
  //           tenure
  //         }) );

  //     console.log(res)
  //     if (res.data.success) {
  //       setLoanName("");
  //       setLender("");
  //       setAmount(0);
  //       setPanNum("");
  //       setDate("");
  //       setTenure("");

  //       toast("Loan Added")
  //     }
  //   } catch {
  //     toast("Error occurred");
  //   }
  // };

  return (
  <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28">
    <Toaster />

    {/* Ambient blobs */}
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full" />
    <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 blur-3xl rounded-full" />

    <div className="relative max-w-7xl mx-auto px-6 space-y-20">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent">
          Credit & Loans
        </h1>
        <p className="text-slate-300 mt-4 max-w-2xl">
          Understand your credit strength and manage business loans confidently.
        </p>
      </motion.div>

      {/* SUMMARY CARDS (like StockReport) */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-slate-400">Estimated Score</p>
          <p className="text-3xl font-bold text-indigo-400">
            {score || "--"}
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-slate-400">Credit Category</p>
          <p className="text-3xl font-bold text-white">
            {show ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][index] : "--"}
          </p>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-slate-400">Risk Level</p>
          <p
            className={`text-3xl font-bold ${
              index <= 1
                ? "text-red-400"
                : index === 2
                ? "text-amber-400"
                : "text-emerald-400"
            }`}
          >
            {show ? (index <= 1 ? "High" : index === 2 ? "Medium" : "Low") : "--"}
          </p>
        </div>
      </div>

      {/* CREDIT SCORE SIMULATOR CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl backdrop-blur-xl"
      >
        <h2 className="text-3xl font-bold mb-6">
          Credit Score Simulator
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            ["Payment History (%)", paymentHistory, setPaymentHistory],
            ["Credit Utilization (%)", ratio, setRatio],
            ["Credit History (Years)", year, setYear],
            ["Recent Inquiries", inquiries, setInquiries],
          ].map(([label, value, setter], i) => (
            <div key={i}>
              <label className="text-sm text-slate-300">{label}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-400 outline-none"
              />
            </div>
          ))}
        </div>

        <button
          onClick={calculateScore}
          className="mt-8 px-8 py-3 rounded-full font-bold text-black
          bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400"
        >
          Calculate Score →
        </button>

        {show && (
          <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-6">
            <CreditGauge score={score} />
            <p className="text-slate-300 mt-4">
              {scores_rate[index]}
            </p>
          </div>
        )}
      </motion.div>

      <AddLoanCard email={email} name={name} />

      {/* ADD LOAN (ACTION CARD) */}
      {/* <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl backdrop-blur-xl"
      >
        <h2 className="text-3xl font-bold mb-6">
          Add Loan
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            ["Loan Type", loanName, setLoanName],
            ["Lender", lender, setLender],
            ["Amount (₹)", amount, setAmount],
            ["PAN Number", panNum, setPanNum],
            ["Tenure", tenure, setTenure],
          ].map(([label, value, setter], i) => (
            <div key={i}>
              <label className="text-sm text-slate-300">{label}</label>
              <input
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
              />
            </div>
          ))}

          <div>
            <label className="text-sm text-slate-300">Start Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleChange}
          className="mt-8 px-8 py-3 rounded-full font-bold text-black
          bg-gradient-to-r from-emerald-400 to-teal-400"
        >
          Add Loan →
        </button>
      </motion.div> */}



      {/* LOAN SCHEMES (CARD GRID like StockReport) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {[
          {
            title: "Pradhan Mantri Mudra Yojana",
            desc: "Loans up to ₹10 lakh for MSMEs.",
            link: "https://www.mudra.org.in/",
          },
          {
            title: "CGTMSE",
            desc: "Collateral-free loans up to ₹2 crore.",
            link: "https://www.cgtmse.in/",
          },
          {
            title: "SIDBI",
            desc: "Loans for MSME expansion & working capital.",
            link: "https://www.sidbi.in/",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-black/40 border border-white/10 rounded-2xl p-6
            hover:border-indigo-400/50 transition"
          >
            <h3 className="text-lg font-bold mb-2">
              {s.title}
            </h3>
            <p className="text-slate-300 mb-3">
              {s.desc}
            </p>
            <a
              href={s.link}
              target="_blank"
              className="text-indigo-400 hover:underline"
            >
              Official Website →
            </a>
          </div>
        ))}
      </motion.div>

    </div>
  </section>
);
}

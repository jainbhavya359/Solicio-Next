"use client"

import { useState, useEffect } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCreditStore } from "../store/useCreditStore";

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

export const scores_rate = [
  "Poor 🚨 High risk — difficult approvals & high interest.",
  "Fair ⚠️ Below average — approvals with strict terms.",
  "Good 🙂 Acceptable — loans possible, not best rates.",
  "Very Good ✅ Safe — better rates & approvals.",
  "Excellent 🌟 Elite — best interest & limits.",
];

export default function Loan() {

  const { user } = useUser();
  const email = user?.primaryEmailAddress.emailAddress
  const name = user?.fullName;

  useEffect(() => {
      if(!email){
        return;
      }
  }, []);

  /* Loan form */
  const [loanName, setLoanName] = useState("");
  const [lender, setLender] = useState("");
  const [amount, setAmount] = useState(0);
  const [panNum, setPanNum] = useState("");
  const [date, setDate] = useState("");
  const [tenure, setTenure] = useState("");

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

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/loans", JSON.stringify({
            loanName,
            lender,
            amount,
            panNum,
            date,
            name,
            email,
            tenure
          }) );

      console.log(res)
      if (res.data.success) {
        setLoanName("");
        setLender("");
        setAmount(0);
        setPanNum("");
        setDate("");
        setTenure("");

        toast("Loan Added")
      }
    } catch {
      toast("Error occurred");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28">
      <Toaster />
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 blur-3xl rounded-full" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-24">

        {/* CREDIT SCORE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Credit Score Simulator
          </h2>
          <p className="text-slate-300 mb-6">
            Estimate your business credit strength and understand how lenders
            see you.
          </p>

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
            className="mt-8 px-8 py-3 rounded-full font-bold text-black bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400 hover:opacity-90 transition shadow-lg"
          >
            Calculate Score →
          </button>

          {show && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mt-6 p-6 rounded-2xl bg-black/40 border border-white/10"
            >
              <h3 className="text-lg font-semibold text-slate-300 mb-2">
                Your Estimated Credit Score
              </h3>

              <CreditGauge score={score} />

              <p className="text-slate-300 mt-4">
                {scores_rate[index]}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* ADD LOAN */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
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
            className="mt-8 px-8 py-3 rounded-full font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-400 hover:opacity-90 transition shadow-lg"
          >
            Add Loan →
          </button>
        </motion.div>

        {/* AFFORDABLE LOANS */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-center">
            Affordable Loan Schemes
          </h2>

          {[
            {
              title: "Pradhan Mantri Mudra Yojana",
              desc:
                "Loans up to ₹10 lakh for MSMEs under Shishu, Kishore & Tarun categories.",
              link: "https://www.mudra.org.in/",
            },
            {
              title: "CGTMSE",
              desc:
                "Collateral-free loans up to ₹2 crore with government guarantee.",
              link: "https://www.cgtmse.in/",
            },
            {
              title: "SIDBI",
              desc:
                "MSME-focused loans for expansion, modernization & working capital.",
              link: "https://www.sidbi.in/",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl"
            >
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-slate-300 mb-3">{s.desc}</p>
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

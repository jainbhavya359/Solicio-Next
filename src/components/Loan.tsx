"use client";

import { useState, useEffect } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useCreditStore } from "../store/useCreditStore";
import { scores_rate } from "../utils/store";
import { calculateEMI } from "../utils/emiCal";

/* -------------------------------------------------------------------------- */
/*                              Animated Score                                */
/* -------------------------------------------------------------------------- */

function AnimatedScore({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  const getColor = () => {
    if (value < 600) return "#dc2626";
    if (value < 700) return "#f59e0b";
    return "#16a34a";
  };

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.2,
      ease: "easeOut",
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
    <span
      className="text-5xl font-extrabold tracking-tight"
      style={{ color: getColor() }}
    >
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
  const stroke = 10;
  const circumference = Math.PI * radius;

  const progress = Math.min(
    Math.max((score - min) / (max - min), 0),
    1
  );

  const dashOffset = circumference * (1 - progress);

  const getColor = () => {
    if (score < 600) return "#dc2626";
    if (score < 700) return "#f59e0b";
    return "#16a34a";
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center py-6">
      <svg viewBox="0 0 220 120" className="w-72">
        <path
          d="M20 110 A90 90 0 0 1 200 110"
          fill="none"
          stroke="#e5e7eb"
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
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>

      <div className="-mt-4 text-center">
        <AnimatedScore value={score} />
        <p className="text-sm text-slate-500 mt-1">
          Credit Score
        </p>
      </div>

      <div className="flex justify-between w-64 mt-2 text-xs text-slate-400">
        <span>{min}</span>
        <span>{max}</span>
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
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState(12);
  const [tenure, setTenure] = useState(12);
  const [tenureUnit, setTenureUnit] = useState("months");
  const [repaymentFrequency] = useState("monthly");
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

  const inputClass =
    "w-full mt-2 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Add Loan
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Loan Type
          </label>
          <input
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
            placeholder="Business / Personal"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Lender Name
          </label>
          <input
            value={lender}
            onChange={(e) => setLender(e.target.value)}
            placeholder="Bank / NBFC"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Loan Amount (₹)
          </label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(+e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2">
          <label className="text-sm font-medium text-slate-700">
            Tenure
          </label>
          <input
            type="number"
            value={tenure}
            onChange={(e) => setTenure(+e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Unit
          </label>
          <select
            value={tenureUnit}
            onChange={(e) => setTenureUnit(e.target.value)}
            className={inputClass}
          >
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
        <p className="text-xs text-slate-500">Estimated EMI</p>

        {emi.emi > 0 ? (
          <>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              ₹{emi.emi.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Interest ₹{emi.totalInterest.toLocaleString()} ·
              Total ₹{emi.totalPayable.toLocaleString()}
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-400 mt-2">
            Enter loan details to calculate EMI
          </p>
        )}
      </div>

      <div className="mt-6">
        <label className="text-sm font-medium text-slate-700">
          Loan Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        onClick={submitLoan}
        className="mt-8 w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
      >
        Add Loan →
      </button>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   MAIN                                     */
/* -------------------------------------------------------------------------- */

export default function Loan() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress.emailAddress;
  const name = user?.fullName;

  const [paymentHistory, setPaymentHistory] = useState(95);
  const [ratio, setRatio] = useState(30);
  const [year, setYear] = useState(5);
  const [inquiries, setInquiries] = useState(2);

  const { score, index, show, setScore, setIndex, showResult } =
    useCreditStore();

  const calculateScore = () => {
    const paymentFactor = (paymentHistory / 100) * 35;
    const utilizationFactor = (1 - ratio / 100) * 30;
    const historyFactor = Math.min(year / 20, 1) * 15;
    const inquiryFactor = Math.max(1 - inquiries / 10, 0) * 20;

    const rawScore =
      paymentFactor +
      utilizationFactor +
      historyFactor +
      inquiryFactor;

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
    <section className="py-24 bg-slate-50">
      <Toaster />

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        <div>
          <h1 className="text-5xl font-extrabold text-slate-900">
            Credit & Loans
          </h1>
          <p className="text-slate-600 mt-4 max-w-2xl">
            Understand your credit strength and manage business loans confidently.
          </p>
        </div>

        {/* Summary */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            ["Estimated Score", score || "--", "text-indigo-600"],
            [
              "Credit Category",
              show
                ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][index]
                : "--",
              "text-slate-900",
            ],
            [
              "Risk Level",
              show ? (index <= 1 ? "High" : index === 2 ? "Medium" : "Low") : "--",
              index <= 1
                ? "text-red-600"
                : index === 2
                ? "text-amber-600"
                : "text-emerald-600",
            ],
          ].map(([label, value, color], i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Simulator */}
        <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-slate-900">
            Credit Score Simulator
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              ["Payment History (%)", paymentHistory, setPaymentHistory],
              ["Credit Utilization (%)", ratio, setRatio],
              ["Credit History (Years)", year, setYear],
              ["Recent Inquiries", inquiries, setInquiries],
            ].map(([label, value, setter]: any, i) => (
              <div key={i}>
                <label className="text-sm font-medium text-slate-700">
                  {label}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setter(+e.target.value)}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>

          <button
            onClick={calculateScore}
            className="mt-8 px-8 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Calculate Score →
          </button>

          {show && (
            <div className="mt-8 border-t pt-6">
              <CreditGauge score={score} />
              <p className="text-slate-600 mt-4">
                {scores_rate[index]}
              </p>
            </div>
          )}
        </div>

        <AddLoanCard email={email} name={name} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
              className="
                bg-white
                border border-slate-200
                rounded-2xl
                p-6
                shadow-sm
                hover:shadow-md
                hover:border-emerald-400
                transition
              "
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {s.title}
              </h3>

              <p className="text-slate-600 mb-4 leading-relaxed">
                {s.desc}
              </p>

              <a
                href={s.link}
                target="_blank"
                className="
                  inline-flex items-center
                  text-emerald-600
                  font-medium
                  hover:underline
                "
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

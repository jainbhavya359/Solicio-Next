import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Loan() {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: location.pathname } });
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  /* Loan form */
  const [loanName, setLoanName] = useState("");
  const [lender, setLender] = useState("");
  const [amount, setAmount] = useState(0);
  const [panNum, setPanNum] = useState("");
  const [date, setDate] = useState("");

  /* Credit score */
  const [paymentHistory, setPaymentHistory] = useState(95);
  const [ratio, setRatio] = useState(30);
  const [year, setYear] = useState(5);
  const [inquiries, setInquiries] = useState(2);
  const [credit, setCredit] = useState(0);
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);

  const scores_rate = [
    "Poor 🚨 High risk — difficult approvals & high interest.",
    "Fair ⚠️ Below average — approvals with strict terms.",
    "Good 🙂 Acceptable — loans possible, not best rates.",
    "Very Good ✅ Safe — better rates & approvals.",
    "Excellent 🌟 Elite — best interest & limits.",
  ];

  const calculateScore = () => {
    const score =
      ((35 * paymentHistory) +
        (30 * ratio) +
        (15 * year) +
        (10 * inquiries)) *
      0.1;

    setCredit(Math.round(score));

    if (score <= 549) setIndex(0);
    else if (score <= 649) setIndex(1);
    else if (score <= 699) setIndex(2);
    else if (score <= 749) setIndex(3);
    else setIndex(4);

    setShow(true);
  };

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/loan`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            loanName,
            lender,
            amount,
            panNum,
            date,
            name,
            email,
          }),
        }
      );
      if (res.ok) {
        setLoanName("");
        setLender("");
        setAmount(0);
        setPanNum("");
        setDate("");
      }
    } catch {
      alert("Error occurred");
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28">

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
            <div className="mt-6 p-6 rounded-2xl bg-black/40 border border-white/10">
              <h3 className="text-xl font-bold">
                Score: <span className="text-indigo-400">{credit}</span>
              </h3>
              <p className="text-slate-300 mt-2">{scores_rate[index]}</p>
            </div>
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
              ["Loan Name", loanName, setLoanName],
              ["Lender", lender, setLender],
              ["Amount (₹)", amount, setAmount],
              ["PAN Number", panNum, setPanNum],
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



// import React from "react";
// import { useState, useEffect } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import { Services } from "./Services";
// import { useLocation } from "react-router-dom";


// export default function Loan (){
//     const { user, isAuthenticated, loginWithRedirect } = useAuth0();
//     const [ name, setName ] = useState("");
//     const [ email, setEmail ] = useState("");
//     const location = useLocation();

//     useEffect(() =>{
//         window.scrollTo(0,0);
//     }, []);

//     useEffect(() => {
//         if(!isAuthenticated){
//             loginWithRedirect({
//                 appState: { returnTo: location.pathname }
//             });
//         }else{
//             setName(user.name);
//             setEmail(user.email);
//         }
//     }, [isAuthenticated, user, loginWithRedirect]);

//     const [ loanName , setLoanName ] = useState("");
//     const [ lender, setLender ] = useState("");
//     const [ amount, setAmount ] = useState(0);
//     const [ panNum, setPanNum ] = useState("");
//     const [ date, setDate ] = useState("");

//     const [ paymentHistory, setPaymentHistory ] = useState(95);
//     const [ ratio, setRatio ] = useState(30);
//     const [ year, setYear ] = useState(5);
//     const [ inquiries, setInquiries] = useState(2);
//     const [ credit, setCredit ] = useState(0);
//     const [ index, setIndex ] = useState(0);

//     const [ show, setShow] = useState(false);

//     const handleChange = async(event) => {
//         event.preventDefault();

//         if(isAuthenticated){
            
//         }
//         try{
//             const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/loan`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({loanName, lender, amount, panNum, date, name, email})
//             });

//             if (response.ok) {
//                 setLoanName("");
//                 setAmount(0);
//                 setLender("");
//                 setPanNum("");
//                 setDate("");
//             } else {
//                 alert('Failed to send message');
//             }
//         } catch (err) {
//             console.error('Error:', err);
//             alert('Error occurred');
//         }
//     }

//     const scores_rate = [
//         "Poor 🚨   High risk : difficult to get loans or credit cards. If approved, interest rates will be very high.",
//         "Fair ⚠️   Below average : lenders may approve but with strict terms, collateral, or higher interest rates.",
//         "Good 🙂   Acceptable score : you may get loans, though not always the best terms.",
//         "Very Good ✅   Safe range : most banks/NBFCs will offer loans & cards with decent interest rates.",
//         "Excellent 🌟   Top-tier credit profile : easy approvals, higher limits, and lowest interest rates."
//     ];

//     const calculateScore = () => {
//         setCredit(((35 * paymentHistory) + (30 * ratio) + (15 * year) + (10 * inquiries))*0.1);

        

//         if(credit <= 549){
//             setIndex(0);
//         }else if(credit > 549 && credit <= 649){
//             setIndex(1);
//         }else if(credit > 649 && credit <= 699){
//             setIndex(2);
//         }else if(credit > 699 && credit <= 749){
//             setIndex(3);
//         }else if(credit > 749 && credit <= 900){
//             setIndex(4);
//         }

//         setShow(true);
//     }

//     return (
//         <div className="m-2 pt-9 mt-7">

//             <div className="flex flex-col justify-start gap-4 rounded-xl shadow-md p-5 m-5 bg-gray-50">
//                 <h2 className="text-2xl font-bold border-b-2 pb-3 text-indigo-500">Credit Score Simulator</h2>
//                 <div>
//                     <p>
//                         This tool is a simplified simulator to help you understand the major factors that contribute to a business credit score. Input your data and see a simulated score and what it means.
//                     </p>
//                     <em className="text-gray-500 text-sm">Note: This is not a real credit score calculation and should be used for educational purposes only.</em>
//                 </div>
                
//                 <div className="grid grid-cols-2 grid-rows-2">
//                     <div className="flex flex-col justify-start m-3">
//                         <label>Payment History (%)</label>
//                         <input type="number" className="border border-gray-300 rounded w-5/6 pl-3 pr-10 py-2 focus:outline-none" onChange={(e)=>{setPaymentHistory(e.target.value)}} min="0" max="100" value={paymentHistory} />
//                         <p className="text-gray-500 text-sm">Percentage of on-time payments (e.g., 95 for 95%).</p>
//                     </div>
                    
//                     <div className="flex flex-col justify-start m-3">
//                         <label>Credit Utilization Ratio (%)</label>
//                         <input type="number" className="border border-gray-300 rounded w-5/6 pl-3 pr-10 py-2 focus:outline-none" onChange={(e)=>{setRatio(e.target.value)}} min="0" max="100" value={ratio} />
//                         <p className="text-gray-500 text-sm">Percentage of available credit used (ideally below 30%).</p>
//                     </div>

//                     <div className="flex flex-col justify-start m-3">
//                         <label>Years of Credit History</label>
//                         <input type="number" className="border border-gray-300 rounded w-5/6 pl-3 pr-10 py-2 focus:outline-none" onChange={(e)=>{setYear(e.target.value)}} min="0" value={year} />
//                         <p className="text-gray-500 text-sm">The age of your oldest credit account in years.</p>
//                     </div>

//                     <div className="flex flex-col justify-start m-3">
//                         <label>Recent Credit Inquiries</label>
//                         <input type="number" className="border border-gray-300 rounded w-5/6 pl-3 pr-10 py-2 focus:outline-none" onChange={(e)=>{setInquiries(e.target.value)}} min="0" value={inquiries} />
//                         <p className="text-gray-500 text-sm">Number of times you have recently applied for new credit.</p>
//                     </div>
//                 </div>

//                 <button onClick={calculateScore} className="bg-indigo-200 w-1/6 rounded-3xl p-2 shadow-md shadow-indigo-100 transition delay-100 duration-200 hover:-translate-y-1 hover:scale-105">Calculate Score</button>
                
//                 <div className={show ? "block rounded-xl shadow-[inset_0_4px_6px_rgba(0,0,0,0.09)] p-5" : "hidden rounded-xl shadow-[inset_0_4px_6px_rgba(0,0,0,0.09)] p-5"}>
//                     <h3>Simulated Credit Score: <span id="scoreValue">{credit}</span></h3>
//                     <p >{scores_rate[index]}</p>
//                 </div>
//                 <div></div>
//             </div>

//             <div className="flex flex-col justify-start gap-4 rounded-xl shadow-md p-5 m-5 bg-gray-50">
//                 <h2 className="text-teal-600 text-2xl font-bold border-b-2 pb-3">My Loan Statements</h2>
//                 <p>
//                     Keep all your loan information in one place. Add new loans to your list to easily track and manage your financial obligations.
//                 </p>
                
//                 <div className="grid grid-cols-2 grid-rows-2">
//                     <div className="flex flex-col justify-start m-3">
//                         <label>Loan Name</label>
//                         <input type="text" onChange={(e) => setLoanName(e.target.value)} className="border border-gray-300 rounded w-5/6 pl-3 pr-10 py-2 focus:outline-none" placeholder="e.g., Working Capital Loan" />
//                     </div>
//                     <div className="flex flex-col justify-start m-3">
//                         <label>Lender</label>
//                         <input type="text" onChange={(e) => setLender(e.target.value)} className="border border-gray-300 rounded w-5/6 pl-3 pr-10 py-2 focus:outline-none" placeholder="e.g., State Bank of India" />
//                     </div>
//                     <div className="flex flex-col justify-start m-3">
//                         <label>Amount (₹)</label>
//                         <input type="number" onChange={(e) => setAmount(e.target.value)} className="border border-gray-300 rounded w-5/6 pl-3 pr-10 py-2 focus:outline-none" placeholder="e.g., 500000" />
//                     </div>
//                     <div className="flex flex-col justify-start m-3">
//                         <label>Pan Number</label>
//                         <input type="text" onChange={(e) => setPanNum(e.target.value)} className="border border-gray-300 rounded w-5/6 pl-3 pr-10 py-2 focus:outline-none" placeholder="e.g., ABCDE1234F" />
//                     </div>
//                     <div className="flex flex-col justify-start m-3">
//                         <label>Start Date</label>
//                         <input type="date" onChange={(e) => setDate(e.target.value)} className="border border-gray-300 rounded w-5/6 pl-3 pr-10 py-2 focus:outline-none" />
//                     </div>
//                 </div>
//                 <button onClick={handleChange} className="bg-emerald-200 w-1/6 rounded-3xl p-2 shadow-md shadow-emerald-100 transition delay-100 duration-200 hover:-translate-y-1 hover:scale-105">Add Loan</button>

//                 <div id="loanList" className="loan-list">
//                 </div>
//             </div>

//             <div className="rounded-xl shadow-[inset_0_4px_6px_rgba(0,0,0,0.09)] p-5 m-5 bg-gray-50">
//                 <h2 class="font-bold text-2xl border-b-2 text-teal-600 mb-4">Affordable Loan Finder</h2>
//                 <p class="section-description">Explore these government schemes and trusted organizations that provide loans with affordable interest rates for MSMEs.</p>

//                 <div class="list-container">
//                     <div className="flex flex-col justify-start gap-4 rounded-xl shadow-md p-8 m-4">
//                         <h3 className="text-xl font-bold">Pradhan Mantri Mudra Yojana (PMMY)</h3>
//                         <p class="list-description">
//                             Provides loans up to ₹10 lakh to non-corporate, non-farm small/micro-enterprises. The scheme has three categories: Shishu (up to ₹50k), Kishore (₹50k-₹5 lakh), and Tarun (₹5 lakh-₹10 lakh).
//                         </p>
//                         <a href="https://www.mudra.org.in/" target="_blank" className="text-purple-800">
//                             Official Website →
//                         </a>
//                     </div>

//                     <div className="flex flex-col justify-start gap-4 rounded-xl shadow-md p-8 m-4">
//                         <h3 className="text-xl font-bold">Credit Guarantee Fund Trust for Micro &amp; Small Enterprises (CGTMSE)</h3>
//                         <p class="list-description">
//                             Offers collateral-free loans up to ₹2 crore. It provides a guarantee cover to the lending institutions, making it easier for MSMEs to secure funding without third-party guarantees.
//                         </p>
//                         <a href="https://www.cgtmse.in/" target="_blank" className="text-purple-800">
//                             Official Website →
//                         </a>
//                     </div>

//                     <div className="flex flex-col justify-start gap-4 rounded-xl shadow-md p-8 m-4">
//                         <h3 className="text-xl font-bold">SIDBI (Small Industries Development Bank of India)</h3>
//                         <p class="list-description">
//                             A major financial institution dedicated to MSME development. SIDBI offers a wide range of loans for modernization, expansion, and working capital under various schemes.
//                         </p>
//                         <a href="https://www.sidbi.in/" target="_blank" className="text-purple-800">
//                             Official Website →
//                         </a>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
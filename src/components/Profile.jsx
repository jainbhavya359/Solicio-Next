"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";

import SectionCard from "./SectionCard";

// Existing components
import { CreditGauge } from "./Loan";
import { useCreditStore } from "../store/useCreditStore";
import LedgerSearchBox from "./LedgerSearchBox";
import StockReport from "./StockReport";
import LedgerEntries from "./LedgerEntries";
import ProfitLossReport from "./ProfitLossReoprt";
import StockValuation from "./StockValuation";
import StockAlertSmart from "./StockAlert";
import CashFlowWatch from "./CashFlow";
import SlowMovingStock from "./SlowMovingStockAlert";
import BusinessHealthCard from "./BusinessHealthCard";
import AlertsFeed from "./AlertsFeed";

export default function Profile() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const { score, show } = useCreditStore();

  const [loans, setLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);

  useEffect(() => {
    if (!email) return;

    axios
      .get("/api/loans", { params: { email } })
      .then(res => setLoans(res.data))
      .finally(() => setLoadingLoans(false));
  }, [email]);

  return (
    <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-black min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6 space-y-16">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6"
        >
          <UserButton />
          <div>
            <h1 className="text-3xl font-bold">{user?.fullName}</h1>
            <p className="text-slate-400">{email}</p>
          </div>
        </motion.div>

        {/* OVERVIEW */}
        <SectionCard
          title="Business Overview"
          subtitle="High-level snapshot"
        >
          <BusinessHealthCard email={email}/>
          <div className="grid my-5 md:grid-cols-2 gap-6">
            {show && <CreditGauge score={score} />}
            <CashFlowWatch compact />
          </div>
        </SectionCard>

        {/* LOANS */}
        <SectionCard
          title="Loans & Credit"
          subtitle="Active loans & lending profile"
        >
          {loadingLoans ? (
            <p className="text-slate-400">Loading loans...</p>
          ) : loans.length === 0 ? (
            <p className="text-slate-400">No active loans</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {loans.map(loan => (
                <div
                  key={loan._id}
                  className="rounded-xl bg-black/40 border border-white/10 p-4"
                >
                  <p className="font-semibold">{loan.loan}</p>
                  <p className="text-sm text-slate-400">{loan.lender}</p>
                  <p className="text-emerald-400 font-bold mt-2">
                    ₹{loan.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* INVENTORY */}
        <SectionCard
          title="Inventory"
          subtitle="Stock, valuation & alerts"
        >
          <div className="space-y-10">
            <StockReport visible compact />
            <StockAlertSmart />
            <StockValuation />
          </div>
        </SectionCard>

        {/* LEDGER */}
        <SectionCard
          title="Ledger"
          subtitle="Purchase & sales history"
        >
          <LedgerSearchBox email={email} />
          <LedgerEntries />
        </SectionCard>

        {/* FINANCE */}
        <SectionCard
          title="Finance"
          subtitle="Profitability & cash movement"
        >
          <div className="space-y-10">
            <ProfitLossReport compact />
            <CashFlowWatch />
          </div>
        </SectionCard>

        {/* ALERTS & INSIGHTS */}
        <SectionCard
          title="Alerts & Insights"
          subtitle="System-generated recommendations"
        >
          <div className="space-y-8">
            <SlowMovingStock />
            <AlertsFeed email={email} />
          </div>
        </SectionCard>

      </div>
    </section>
  );
}


// "use client"

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// //import StockReport from "./StockReport";
// //import License_Report from "./License_Report";
// import axios from "axios";
// import {  UserButton, UserProfile, useUser } from "@clerk/nextjs";
// import { CreditGauge } from "./Loan";
// import { useCreditStore } from "../store/useCreditStore";
// import StockHistory from "./StockHistory";
// import { scores_rate } from "../utils/store";
// import StockReport from "./StockReport";
// import LedgerEntries from "./LedgerEntries";
// import ProfitLossReport from "./ProfitLossReoprt";
// import StockValuation from "./StockValuation";
// import StockAlertSmart from "./StockAlert";
// import CashFlowWatch from "./CashFlow";
// import SlowMovingStock from "./SlowMovingStockAlert";
// import UniversalSearchBox from "./SearchBox";
// import LedgerSearchBox from "./LedgerSearchBox";
// import BusinessHealthCard from "./BusinessHealthCard";
// import StockMovementCard from "./StockMovementCard";
// import SalesTrendCard from "./SalesTrendCard";
// import InventoryBalanceCard from "./InventoryBalanceCard";
// import ActivityRecencyCard from "./ActivityRecencyCard";
// import AlertsFeed from "./AlertsFeed";
// import DailySnapshotCard from "./DailySnapShotCard";

// export default function Profile() {
  
//   const [results, setResults] = useState([]);
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reload, setReload] = useState(false);

//   const { score, index, show } = useCreditStore();

//   const {user} = useUser();
//   const email = user?.primaryEmailAddress?.emailAddress;
//   console.log(email);

//   const userButtonAppearance = {
//     elements: {
//       userButtonAvatarBox: "w-1 h-1  rounded-full ring-4 ring-indigo-500/30"
//     },
//   };

//   useEffect(() => {
//     if(!email){
//       setLoading(true);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         console.log(email);
//         const res = await axios.get("/api/loans", {
//           params: { email },
//         });
//         console.log(res);
//         setData(res.data);
//       } catch (err) {
//         setError(err.message);
//         console.log(err);
//         throw new Error("Network issue");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [email, reload]);

//   const onHandleClick = async (id) => {
//     try {
//       await axios.delete(`/api/deleteLoan?id=${id}`);
//       setReload(true);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28">

//       {/* Background blobs */}
//       <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
//       <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl" />

//       <div className="relative max-w-7xl mx-auto px-6 space-y-20">

//         {/* PROFILE HEADER */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//           className="flex flex-col md:flex-row items-center gap-6"
//         >
          
//           <UserButton appearance={userButtonAppearance}/>
        
//           <div>
//             <h1 className="text-3xl font-extrabold">{user?.fullName}</h1>
//             <p className="text-slate-400">{email}</p>
//           </div>
//         </motion.div>

//         <LedgerSearchBox email={email}/>

//         {show && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.4 }}
//             className="mt-6 p-6 rounded-2xl bg-black/40 border border-white/10"
//           >
//             <h3 className="text-lg font-semibold text-slate-300 mb-2">
//               Your Estimated Credit Score
//             </h3>

//             <CreditGauge score={score} />

//             <p className="text-slate-300 mt-4">
//               {scores_rate[index]}
//             </p>
//           </motion.div>
//         )}

//         {/* LOANS */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
//         >
//           <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
//             Your Loans
//           </h2>

//           {loading ? (
//             <div className="flex justify-center py-12">
//               <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
//             </div>
//           ) : error ? (
//             <p className="text-red-400">{error}</p>
//           ) : data && data.filter(l => l.email === email).length > 0 ? (
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {data
//                 .filter(loan => loan.email === email)
//                 .map((loan) => (
//                   <motion.div
//                     key={loan._id}
//                     whileHover={{ y: -4 }}
//                     transition={{ duration: 0.2 }}
//                     className="bg-black/40 border border-white/10 rounded-2xl p-6
//                     hover:border-indigo-400/50 transition"
//                   >
//                     {/* Header */}
//                     <div className="mb-4">
//                       <p className="text-lg font-semibold text-white">
//                         {loan.loan}
//                       </p>
//                       <p className="text-xs text-slate-400">
//                         {loan.lender}
//                       </p>
//                     </div>

//                     {/* Amount */}
//                     <div className="mb-4">
//                       <p className="text-xs text-slate-400">Loan Amount</p>
//                       <p className="text-2xl font-bold text-emerald-400">
//                         ₹{loan.amount.toLocaleString()}
//                       </p>
//                     </div>

//                     {/* Date */}
//                     <div className="text-xs text-slate-400 mb-4">
//                       Started on{" "}
//                       {new Date(loan.date).toISOString().split("T")[0]}
//                     </div>

//                     {/* Action */}
//                     <button
//                       onClick={() => onHandleClick(loan._id)}
//                       className="w-full px-4 py-2 rounded-xl
//                       border border-red-500/60 text-red-400
//                       hover:bg-red-500/10 transition"
//                     >
//                       Remove Loan
//                     </button>
//                   </motion.div>
//                 ))}
//             </div>
//           ) : (
//             <p className="text-slate-400">No loans found.</p>
//           )}
//         </motion.div>




//         {/* REPORTS */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           viewport={{ once: true }}
//           className="space-y-16"
//         >
//           <StockReport visible={true}
//                 productSetter={""}
//                 purchaseSetter={""}
//                 saleSetter={""}/>
//         </motion.div>


//         <StockHistory />
        
//         <LedgerEntries />

//         <BusinessHealthCard email={email} />

//         <ProfitLossReport />
        
//         <StockAlertSmart />

//         <StockValuation />

//         <CashFlowWatch />

//         <SlowMovingStock />

//         <AlertsFeed email={email} />

//       </div>
//     </section>
//   );
// }

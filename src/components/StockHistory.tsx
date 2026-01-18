"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import StockHistoryTable from "./StockHistoryTable";

export default function StockHistory() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    if (!email) return;

    axios
      .get(`/api/stock?email=${email}`)
      .then(res => {
        const rows = res.data || [];

        setPurchases(rows.filter((r: any) => r.voucher === "Purchase"));
        setSales(rows.filter((r: any) => r.voucher === "Sale"));
      })
      .catch(() => {
        toast.error("Network error");
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [email]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
    >
      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Stock History
      </h2>

      <p className="text-slate-300 mb-6">
        Purchases and sales recorded in your inventory
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-400">Error loading stock history.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StockHistoryTable
            title="Purchases"
            subtitle="Stock added to inventory"
            rows={purchases}
            type="Purchase"
          />

          <StockHistoryTable
            title="Sales"
            subtitle="Stock sold to customers"
            rows={sales}
            type="Sale"
          />
        </div>
      )}
    </motion.section>
  );
}


// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { useUser } from "@clerk/nextjs";
// import toast from "react-hot-toast";

// export default function StockHistory() {

//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState([]);

//   const {user} = useUser();
  
//   const email = user?.primaryEmailAddress.emailAddress;
  

//   useEffect(() => {
//     if(!email) return;


//     const fetchStock = async () => {
//       try {
//         const response = await axios.get(`/api/stock?email=${email}`);
//         if (!response.data) throw new Error("Network error");
//         setData(response.data);
//     } catch {
//         toast("Nextwork Error");
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStock();
//   }, [email]);


//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 40 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       viewport={{ once: true }}
//       className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
//     >
//       <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
//         Stock History
//       </h2>

//       <p className="text-slate-300 mb-6">
//         Recent purchase and sale activity
//       </p>

//       {loading ? (
//         <div className="flex justify-center py-12">
//           <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
//         </div>
//       ) : error ? (
//         <p className="text-red-400">Error loading stock data.</p>
//       ) : data.length === 0 ? (
//         <p className="text-slate-400">
//           No stock activity recorded yet.
//         </p>
//       ) : (
//         <div className="mt-6 border border-white/10 rounded-xl overflow-hidden">
//           {/* HEADER */}
//           <div className="grid grid-cols-12 text-xs text-slate-400 bg-black/40 px-4 py-3">
//             <div className="col-span-3">Product</div>
//             <div className="col-span-2">Type</div>
//             <div className="col-span-2">Qty</div>
//             <div className="col-span-2">Rate</div>
//             <div className="col-span-3">Entry No / Date</div>
//           </div>

//           {/* ROWS */}
//           {data.map((stock, index) => {
//             const isPurchase = stock.voucher === "Purchase";

//             return (
//               <div
//                 key={stock._id}
//                 className={`grid grid-cols-12 px-4 py-3 text-sm
//                   border-t border-white/5
//                   hover:bg-white/5 transition
//                   ${index % 2 === 0 ? "bg-black/30" : "bg-black/20"}
//                 `}
//               >
//                 {/* PRODUCT */}
//                 <div className="col-span-3 font-medium text-white">
//                   {stock.name}
//                 </div>

//                 {/* TYPE */}
//                 <div
//                   className={`col-span-2 font-semibold
//                     ${
//                       isPurchase
//                         ? "text-emerald-400"
//                         : "text-rose-400"
//                     }`}
//                 >
//                   {stock.voucher}
//                 </div>

//                 {/* QUANTITY */}
//                 <div className="col-span-2">
//                   {stock.quantity}{" "}
//                   <span className="text-slate-400">
//                     {stock.unit}
//                   </span>
//                 </div>

//                 {/* RATE */}
//                 <div className="col-span-2 font-medium">
//                   ₹{stock.price}
//                 </div>

//                 {/* META */}
//                 <div className="col-span-3 text-xs text-slate-400 leading-tight">
//                   <div>{stock.entryNo}</div>
//                   <div>
//                     {new Date(stock.date)
//                       .toISOString()
//                       .split("T")[0]}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </motion.section>
//   );

// }

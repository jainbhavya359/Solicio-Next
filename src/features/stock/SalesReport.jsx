"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { FileText, Search, Package, Hash } from "lucide-react";

export default function SalesHistory() {

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const { user } = useUser();

  const email = user?.primaryEmailAddress.emailAddress;


  useEffect(() => {
    if (!email) return;

    const fetchStock = async () => {
      try {
        const response = await axios.get(`/api/sellStock?email=${email}`);
        if (!response.data) throw new Error("Network error");
        setData(response.data);
      } catch {
        toast("Network Error");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [email]);


  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl sm:rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full"
    >
      {/* HEADER */}
      <div className="p-4 sm:p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
            <FileText className="h-5 w-5 sm:h-7 sm:w-7" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight">
              Current Sales Report
            </h2>
            <p className="text-[10px] sm:text-sm font-medium text-slate-500 uppercase tracking-widest mt-0.5 sm:mt-1">
              Insights into your recent sales activity.
            </p>
          </div>
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="flex-1 w-full overflow-hidden">
        <div className="h-full overflow-auto scrollbar-hide">
          <div className="min-w-full p-0 sm:p-6">
            {/* HEAD (Desktop) */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 mb-4">
              <div className="col-span-2">Date</div>
              <div className="col-span-4">Product Information</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-2 text-right">Quantity</div>
              <div className="col-span-1 text-right">Price (₹)</div>
              <div className="col-span-2 text-right">Entry No</div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-24 flex flex-col items-center justify-center"
                >
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-full" />
                    <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Compiling history...</p>
                </motion.div>
              ) : error ? (
                <div className="py-24 text-center text-red-500 font-bold">Error loading sales data.</div>
              ) : data.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-24 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 rounded-[2.5rem] bg-slate-50 text-slate-300 flex items-center justify-center mb-6">
                    <Search size={40} />
                  </div>
                  <p className="text-slate-500 font-bold text-lg">No sales history yet.</p>
                  <p className="text-sm text-slate-400 mt-2">Start registering sales to see history</p>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                  }}
                  className="space-y-3 sm:space-y-3 p-4 sm:p-0"
                >
                  {data.map((stock) => (
                    <motion.div
                      key={stock._id}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0 }
                      }}
                      className="relative overflow-hidden transition-all hover:shadow-md sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:px-6 sm:py-4 sm:rounded-2xl sm:border rounded-xl border p-4 flex flex-col gap-3 bg-white border-slate-100 hover:border-emerald-100 group"
                    >
                      {/* Mobile Header Row */}
                      <div className="flex justify-between items-start sm:hidden">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">{new Date(stock.date).toISOString().split("T")[0]}</span>
                          <span className="text-[10px] font-medium text-slate-400">Transaction Date</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600">
                          {stock.voucher}
                        </span>
                      </div>

                      {/* DESKTOP: Date (Col 2) */}
                      <div className="col-span-2 hidden sm:block">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-900">{new Date(stock.date).toISOString().split("T")[0]}</span>
                          <span className="text-[10px] font-medium text-slate-400">Transaction Date</span>
                        </div>
                      </div>

                      {/* DESKTOP: Product (Col 4) + MOBILE: Product Info */}
                      <div className="col-span-4 w-full sm:w-auto">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="p-2 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors hidden sm:block">
                            <Package size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 capitalize leading-tight truncate">{stock.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[10px] sm:text-xs font-medium text-slate-400 uppercase tracking-widest">{stock.unit}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* DESKTOP: Type (Col 1) */}
                      <div className="col-span-1 hidden sm:block">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600">
                          {stock.voucher}
                        </span>
                      </div>

                      {/* Mobile: Financials Row */}
                      <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50 sm:hidden">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Quantity</span>
                          <span className="text-sm font-black text-emerald-600">
                            {stock.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end mr-2">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Price (₹)</span>
                            <span className="text-sm font-black text-slate-900">₹{stock.price.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                            <Hash size={16} />
                          </div>
                        </div>
                      </div>

                      {/* DESKTOP: Quantity (Col 2) */}
                      <div className="col-span-2 text-right hidden sm:block">
                        <span className="text-sm font-black text-emerald-600">
                          {stock.quantity}
                        </span>
                      </div>

                      {/* DESKTOP: Price (Col 1) */}
                      <div className="col-span-1 text-right hidden sm:block">
                        <span className="text-sm font-black text-slate-900">
                          ₹{stock.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* DESKTOP: EntryNo (Col 2) */}
                      <div className="col-span-2 text-right hidden sm:block">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100/50 border border-slate-200/50 text-[10px] font-mono font-bold text-slate-500 shadow-sm">
                          <Hash size={12} />
                          {stock.entryNo}
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

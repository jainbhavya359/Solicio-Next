"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

export default function StockHistory() {

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const {user} = useUser();
  
  const email = user?.primaryEmailAddress.emailAddress;
  

  useEffect(() => {
    if(!email) return;


    const fetchStock = async () => {
      try {
        const response = await axios.get(`/api/stock?email=${email}`);
        if (!response.data) throw new Error("Network error");
        setData(response.data);
    } catch {
        toast("Nextwork Error");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [email]);


  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
    >
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
        Current Stock History
      </h2>

      <p className="text-slate-300 mb-15">
        Insights into your recent purchase activity.
      </p>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-red-400">Error loading stock data.</p>
      ) : data.length === 0 ? (
        <p className="text-slate-400">
          No stock data found. Add inventory to view your report.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-white/10 text-slate-300">
              <tr>
                <th className="py-3 text-left">Product</th>
                <th className="py-3 text-left">Voucher Type</th>
                <th className="py-3 text-left">Quantity</th>
                <th className="py-3 text-left">Price per Unit(₹)</th>
                <th className="py-3 text-left">Date</th>
                <th className="py-3 text-left">EntryNo</th>
              </tr>
            </thead>
            <tbody>
              {data.map((stock, index) => (
                <tr
                  key={stock._id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-4">{stock.name}</td>
                  <td className="py-4">{stock.voucher}</td>
                  <td className="py-4 font-semibold">{stock.quantity} {stock.unit}</td>
                  <td className="py-4">
                    ₹{stock.price.toLocaleString()}
                  </td>
                  <td className="py-4 text-slate-400">
                    {new Date(stock.date).toISOString().split("T")[0]}
                  </td>
                  <td className="py-4">{stock.entryNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.section>
  );
}

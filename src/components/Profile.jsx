"use client"

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import StockReport from "./StockReport";
import License_Report from "./License_Report";

export function Profile() {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: location.pathname } });
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/getLoan`);
        if (!res.ok) throw new Error("Network issue");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
    setReload(false);
  }, [isAuthenticated, reload]);

  const onHandleClick = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/deleteLoans/${id}`, {
        method: "DELETE",
      });
      setReload(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-28">

      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 space-y-20">

        {/* PROFILE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-center gap-6"
        >
          <img
            src={user?.picture}
            alt={user?.name}
            className="w-20 h-20 rounded-full ring-4 ring-indigo-500/30"
          />
          <div>
            <h1 className="text-3xl font-extrabold">{user?.name}</h1>
            <p className="text-slate-400">{user?.email}</p>
          </div>
        </motion.div>

        {/* LOANS */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Your Loans
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : data && data.filter(l => l.email === user.email).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-slate-300 border-b border-white/10">
                  <tr>
                    <th className="py-3 text-left">Loan</th>
                    <th className="py-3 text-left">Bank</th>
                    <th className="py-3 text-left">Amount</th>
                    <th className="py-3 text-left">Date</th>
                    <th className="py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((loan, i) =>
                    loan.email === user.email ? (
                      <tr
                        key={loan.id}
                        className="border-b border-white/5 hover:bg-white/5 transition"
                      >
                        <td className="py-4">{loan.loan}</td>
                        <td className="py-4">{loan.lender}</td>
                        <td className="py-4 font-semibold">
                          ₹{loan.amount.toLocaleString()}
                        </td>
                        <td className="py-4 text-slate-400">
                          {new Date(loan.date).toISOString().split("T")[0]}
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => onHandleClick(loan.id)}
                            className="px-4 py-1 rounded-full border border-red-500 text-red-400 hover:bg-red-500/10 transition"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-400">No loans found.</p>
          )}
        </motion.div>

        {/* REPORTS */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          <StockReport />
          <License_Report />
        </motion.div>

      </div>
    </section>
  );
}

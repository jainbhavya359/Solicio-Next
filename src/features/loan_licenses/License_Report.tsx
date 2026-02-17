"use client";

import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, FileCheck, Search, Zap, Activity } from "lucide-react";
import { LicenseCard } from "../../components/ui/LicenseCard";

type License = {
  _id: string;
  licName: string;
  authority: string;
  date?: string;
  email?: string;
  licenseName?: string;
  expiryDate?: string;
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LicenseReport() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLicenses = async () => {
    if (!email) return;

    try {
      const res = await axios.get<License[]>(
        `/api/licenses?email=${email}`
      );
      setLicenses(res.data);
    } catch (err) {
      console.error("Failed to fetch licenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicenses();
  }, [email]);

  const deleteLicense = async (id: string) => {
    try {
      await axios.delete(`/api/licenses?id=${id}`);
      fetchLicenses();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-24 shadow-sm flex flex-col items-center justify-center font-outfit">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-50 rounded-full" />
          <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-8 text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Synchronizing Registry...</p>
      </div>
    );
  }

  return (
    <section className="space-y-12 font-outfit">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tightest">
              Regulatory <span className="text-emerald-600">Compliance</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Active Operational Credentials
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-100">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Integrity: Verified</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {licenses.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] border border-slate-100 p-24 shadow-xl shadow-slate-200/40 text-center flex flex-col items-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
              <Zap className="w-64 h-64" />
            </div>

            <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 text-slate-200 flex items-center justify-center mb-10 ring-1 ring-inset ring-slate-100">
              <FileCheck size={48} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tightest">Registry Offline</h3>
            <p className="text-slate-500 mt-4 max-w-sm font-medium leading-relaxed italic">
              "No active credentials synchronized. Initialize compliance monitoring to mitigate regulatory risks."
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {licenses.map((lic) => (
              <LicenseCard
                key={lic._id}
                license={lic}
                onDelete={deleteLicense}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

import LedgerHero from "../components/ledger/LedgerHero";
import TransactionInsightStrip from "../components/ledger/TransactionInsightStrip";
import TransactionFeed from "../components/ledger/TransactionFeed";
import FiscalManifest from "../components/ledger/FiscalManifest";
import CurrentSalesReport from "../components/ledger/CurrentSalesReport";
import LedgerInsightPanel from "../components/ledger/LedgerInsightPanel";
import LedgerActionFooter from "../components/ledger/LedgerActionFooter";

import ConfirmReversalModal from "../../ledger/ConfirmReversal";

import { DashboardData } from "../types/dashboard";

export default function LedgerSection({ dashboardData }: { dashboardData: DashboardData | null }) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  // Ledger state
  const [ledgerRows, setLedgerRows] = useState<any[]>([]);
  const [ledgerLoading, setLedgerLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(false);

  // Reversal state
  const [reverseTarget, setReverseTarget] = useState<any | null>(null);
  const [reversing, setReversing] = useState(false);
  const [reversalError, setReversalError] = useState<string | null>(null);

  // Sales state
  const [salesData, setSalesData] = useState<any[]>([]);
  const [salesLoading, setSalesLoading] = useState(true);

  // Fetch Ledger
  const fetchLedger = async () => {
    if (!email) return;
    try {
      setLedgerLoading(true);
      const res = await axios.get("/api/ledger", {
        params: { email, page, limit },
      });
      setLedgerRows(res.data.rows || []);
      setHasMore(res.data.hasMore);
    } catch {
      toast.error("Failed to load ledger feed");
    } finally {
      setLedgerLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, page]);

  // Fetch Sales
  useEffect(() => {
    if (!email) return;
    const fetchSales = async () => {
      try {
        const res = await axios.get(`/api/sellStock?email=${email}`);
        setSalesData(res.data || []);
      } catch {
        console.error("Failed to fetch sales data");
      } finally {
        setSalesLoading(false);
      }
    };
    fetchSales();
  }, [email]);

  // Reversal Action
  const confirmReversal = async () => {
    if (!reverseTarget) return;
    try {
      setReversing(true);
      setReversalError(null);
      await axios.post("/api/ledger/reverse", {
        ledgerId: reverseTarget._id,
        reason: "Manual reversal via Feed",
      });
      toast.success("Transaction reversed successfully");
      setReverseTarget(null);
      await fetchLedger(); // Refresh feed
    } catch (err: any) {
      const msg = err?.response?.data?.error || "This entry cannot be reversed";
      setReversalError(msg);
      toast.error(msg);
    } finally {
      setReversing(false);
    }
  };

  const sh = dashboardData?.stockHistory || [];

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] w-full mx-auto relative z-10 w-full mb-10 overflow-x-hidden">
      
      {/* 1. Top Summary Hero */}
      <LedgerHero stockHistory={sh} ledgerRows={ledgerRows} />

      {/* 2. Anomaly Awareness Strip */}
      <TransactionInsightStrip stockHistory={sh} />

      {/* 3. Narrative Feed (Main Engine replacing LedgerEntries) */}
      <TransactionFeed 
        rows={ledgerRows} 
        hasMore={hasMore} 
        page={page} 
        setPage={setPage} 
        loading={ledgerLoading} 
        onReverseTarget={setReverseTarget} 
      />

      {/* 4. Grouped tracking cards replacing linear StockHistory array */}
      <FiscalManifest data={sh} />

      {/* 5. Minimalist collapsed form of Current Sales Report */}
      {!salesLoading && <CurrentSalesReport salesData={salesData} />}

      {/* 6. AI Textual Generation matching Ledger data */}
      <LedgerInsightPanel stockHistory={sh} />

      {/* 7. Action Matrix CTA */}
      <LedgerActionFooter />

      {/* Reversal Modal overlay portal */}
      <AnimatePresence>
        {reverseTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md" 
             />
             <motion.div 
               initial={{ opacity: 0, y: 20, scale: 0.95 }} 
               animate={{ opacity: 1, y: 0, scale: 1 }} 
               exit={{ opacity: 0, y: 20, scale: 0.95 }}
               className="relative z-10 w-full"
             >
                <ConfirmReversalModal
                  open
                  voucherNo={reverseTarget.voucherNo}
                  itemName={reverseTarget.itemName}
                  loading={reversing}
                  error={reversalError}
                  onClose={() => {
                    setReverseTarget(null);
                    setReversalError(null);
                  }}
                  onConfirm={confirmReversal}
                />
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, TrendingUp, Zap } from "lucide-react";

interface Props {
  stockHistory: any[];
}

export default function TransactionInsightStrip({ stockHistory = [] }: Props) {
  // AI Logic to find large, unusual anomalies
  // For demonstration, let's find the single largest purchase or sale today
  
  if (!stockHistory || stockHistory.length === 0) return null;

  const today = new Date().toISOString().split("T")[0];
  const todaysTx = stockHistory.filter(r => r.date?.startsWith(today));

  let alertMessage = "";
  let type: "info" | "warning" | "success" = "info";

  if (todaysTx.length === 0) {
    alertMessage = "No ledger changes detected today. Systems nominal.";
    type = "info";
  } else {
    // Find biggest Tx today
    const biggest = [...todaysTx].sort((a, b) => (b.quantity * (b.price || 0)) - (a.quantity * (a.price || 0)))[0];
    const val = biggest.quantity * (biggest.price || 0);
    
    if (val > 50000 && (biggest.voucher === "Purchase" || biggest.type === "Purchase")) {
      alertMessage = `Unusual spike in expenses detected today: Massive acquisition of ${biggest.name} for ₹${val.toLocaleString('en-IN')}.`;
      type = "warning";
    } else if (val > 50000 && (biggest.voucher === "Sale" || biggest.type === "Sale")) {
      alertMessage = `High-yield credit detected: Aggressive deployment of ${biggest.name} generating ₹${val.toLocaleString('en-IN')}.`;
      type = "success";
    } else {
      alertMessage = `Steady activity detected: ${todaysTx.length} transactions processed today.`;
      type = "success";
    }
  }

  const styles = {
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  };

  const Icon = type === "warning" ? AlertTriangle : type === "success" ? TrendingUp : Zap;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${styles[type]} shadow-lg`}
      >
        <div className={`p-1.5 rounded-full ${type === "warning" ? "bg-amber-500/20" : type === "success" ? "bg-emerald-500/20" : "bg-blue-500/20"}`}>
          <Icon size={16} />
        </div>
        <p className="text-sm font-bold tracking-wide">
          <span className="opacity-70 font-medium mr-2">System Alert:</span>
          {alertMessage}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

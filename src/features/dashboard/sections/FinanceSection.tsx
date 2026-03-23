"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { DashboardData } from "../types/dashboard";
import { motion, AnimatePresence } from "framer-motion";

// Modals
import FinancialEntryModal from "../../stock/FinancialEntryModal";

// New Components
import FinanceHeaderControls from "../components/finance/FinanceHeaderControls";
import CashFlowCard from "../components/finance/CashFlowCard";
import FinanceHeroCards from "../components/finance/FinanceHeroCards";
import FinanceInsightPanel from "../components/finance/FinanceInsightPanel";
import ProfitBreakdownGrid from "../components/finance/ProfitBreakdownGrid";
import NetProfitHighlight from "../components/finance/NetProfitHighlight";
import ProfitDistributionVisual from "../components/finance/ProfitDistributionVisual";
import FinanceActionFooter from "../components/finance/FinanceActionFooter";

export default function FinanceSection({ dashboardData }: { dashboardData: DashboardData | null }) {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const curr = new Date();
  const firstDay = new Date(curr.getFullYear(), curr.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(curr.getFullYear(), curr.getMonth() + 1, 0).toISOString().split('T')[0];

  const [from, setFrom] = useState(firstDay);
  const [to, setTo] = useState(lastDay);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // Legacy State Support
  const [financialModalType, setFinancialModalType] = useState<"Expense" | "TaxPayment" | "StockWriteOff" | null>(null);

  const load = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await axios.get("/api/profit-loss", {
        params: { email, from, to, t: Date.now() },
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to load P&L", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  if (!data) {
    return (
       <div className="py-24 flex flex-col items-center justify-center bg-[#0a0a0a] border border-white/10 rounded-[2.5rem]">
         <div className="relative w-12 h-12">
           <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
           <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
         </div>
         <p className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Compiling Ledger Core...</p>
       </div>
    );
  }

  const s = data.summary;

  return (
    <div className="flex flex-col max-w-[1400px] w-full mx-auto relative z-10">
      
      {/* Date Controls & Header */}
      <FinanceHeaderControls 
         from={from} 
         to={to} 
         setFrom={setFrom} 
         setTo={setTo} 
         onRecalculate={load} 
         loading={loading}
      />

      <motion.div
         initial={{ opacity: 0, scale: 0.98 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.5 }}
         className={loading ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}
      >
         {/* Top Level Liquidity Indicator (From dashboardData, not isolated P&L date range) */}
         <CashFlowCard data={dashboardData?.cashFlow} />

         {/* Mega Highlight Hero Row */}
         <FinanceHeroCards data={s} />

         {/* AI Text Insight Generation */}
         <FinanceInsightPanel data={s} />

         {/* Breakdown Matrix */}
         <ProfitBreakdownGrid 
            data={s} 
            onAddExpense={() => setFinancialModalType("Expense")} 
            onAddTax={() => setFinancialModalType("TaxPayment")} 
            onAddWriteDown={() => setFinancialModalType("StockWriteOff")}
         />

         {/* Focused Net Yield Card */}
         <NetProfitHighlight data={s} />

         {/* Horizontal Distribution Trace */}
         <ProfitDistributionVisual data={s} />

         {/* Actionable Footer Routes */}
         <FinanceActionFooter />
      </motion.div>

      {/* Preserve old modal functionality verbatim */}
      <AnimatePresence>
        {financialModalType !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                <FinancialEntryModal
                  isOpen={financialModalType !== null}
                  onClose={() => setFinancialModalType(null)}
                  type={financialModalType || "Expense"}
                  onSuccess={load}
                />
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { motion, Variants } from "framer-motion";
import LedgerEntries from "../../ledger/LedgerEntries";
import StockHistory from "../../stock/StockHistory";
import SalesReport from "../../stock/SalesReport";
import { DashboardData } from "../types/dashboard";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function LedgerSection({ dashboardData }: { dashboardData: DashboardData | null }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4 sm:space-y-6"
    >
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
        <LedgerEntries />
      </motion.div>
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
        <StockHistory data={dashboardData?.stockHistory} />
      </motion.div>
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
        <SalesReport />
      </motion.div>
    </motion.div>
  );
}

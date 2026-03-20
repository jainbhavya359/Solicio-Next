"use client";

import { motion, Variants } from "framer-motion";
import SlowMovingStockContainer from "../../Insights/SlowMovingStockContainer";
import AlertsFeed from "../../alerts/AlertsFeed";
import { DashboardData } from "../types/dashboard";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

interface Props {
  dashboardData: DashboardData | null;
  email: string;
}

export default function AlertsSection({ dashboardData, email }: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-4 sm:space-y-6"
    >
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
        <SlowMovingStockContainer data={dashboardData?.slowMoving ?? null} />
      </motion.div>
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
        <AlertsFeed email={email} />
      </motion.div>
    </motion.div>
  );
}

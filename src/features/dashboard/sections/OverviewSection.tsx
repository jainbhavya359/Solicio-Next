"use client";

import { motion, Variants } from "framer-motion";
import { CreditGauge } from "../../../components/Loan";
import { useCreditStore } from "../../../store/useCreditStore";
import BusinessHealthCard from "../../health/BusinessHealthCard";
import CashFlowWatch from "../../Insights/CashFlow";
import {
  ActionSuggestionCard,
  ForecastSummaryCard,
  MarginTrendGraph,
  SalesTrendGraphCard,
  TopProductDonut,
} from "../../Insights/SalesTrendInsightsCard";
import KPICards from "../KPICards";
import DateFilterBar from "../components/DateFilterBar";
import OverviewSkeleton from "../components/skeletons/OverviewSkeleton";
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
  salesTrendData: any | null;
  loadingDashboard: boolean;
  fromDate: string;
  toDate: string;
  setFromDate: (v: string) => void;
  setToDate: (v: string) => void;
  onViewInventory: () => void;
}

export default function OverviewSection({
  dashboardData,
  salesTrendData,
  loadingDashboard,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onViewInventory,
}: Props) {
  const { score } = useCreditStore();

  if (loadingDashboard) return <OverviewSkeleton />;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6 w-full min-w-0"
    >
      {/* Date Filter */}
      <DateFilterBar
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
      />

      {/* KPIs + Business Health */}
      <div className="space-y-4 sm:space-y-8">
        <KPICards data={dashboardData?.kpis} />
        <BusinessHealthCard data={dashboardData?.healthSummary} />
      </div>

      {/* Credit + Cash Flow */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
        <motion.div variants={fadeInUp} className="h-full min-w-0 w-full">
          <CreditGauge score={score} />
        </motion.div>
        <motion.div variants={fadeInUp} className="h-full min-w-0 w-full">
          <CashFlowWatch data={dashboardData?.cashFlow} />
        </motion.div>
      </div>

      {/* Sales Trend Insights */}
      {!salesTrendData ? (
        <div className="bg-white rounded-2xl p-10 text-center text-stone-500 mt-8">
          Unable to load insights
        </div>
      ) : (
        <section className="mx-auto max-w-7xl w-full min-w-0 px-0 sm:px-4 py-8 sm:py-20 space-y-6 sm:space-y-10">
          <div className="w-full min-w-0">
            <SalesTrendGraphCard data={salesTrendData} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 w-full min-w-0">
            <div className="w-full min-w-0 h-full">
              <ForecastSummaryCard data={salesTrendData} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 w-full min-w-0">
            <div className="w-full min-w-0 h-full">
              <TopProductDonut data={salesTrendData} onViewInventory={onViewInventory} />
            </div>
            <div className="w-full min-w-0 h-full">
              <MarginTrendGraph data={salesTrendData} />
            </div>
          </div>
          <div className="w-full min-w-0">
            <ActionSuggestionCard data={salesTrendData} />
          </div>
        </section>
      )}
    </motion.div>
  );
}

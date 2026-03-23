"use client";

import { motion, Variants } from "framer-motion";
import { DashboardData } from "../types/dashboard";
import DateFilterBar from "../components/DateFilterBar";
import OverviewSkeleton from "../components/skeletons/OverviewSkeleton";

// New Dark Premium Components
import OverviewHero from "../components/overview/OverviewHero";
import HealthScoreCard from "../components/overview/HealthScoreCard";
import AlertsPanel from "../components/overview/AlertsPanel";
import MetricsGrid from "../components/overview/MetricsGrid";
import FinancialSnapshot from "../components/overview/FinancialSnapshot";
import TrendChart from "../components/overview/TrendChart";
import SecondaryInsights from "../components/overview/SecondaryInsights";
import SmartActions from "../components/overview/SmartActions";

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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

  if (loadingDashboard) return <OverviewSkeleton />;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8 w-full min-w-0 pb-12"
    >
      {/* Date Filter */}
      <div className="bg-[#050505] p-2 rounded-2xl border border-white/5 inline-block mb-4">
        <DateFilterBar
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
        />
      </div>

      <div className="bg-[#050505] min-h-screen text-slate-200">
          
          <OverviewHero data={dashboardData?.kpis} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="col-span-1 lg:col-span-2">
              <HealthScoreCard data={dashboardData?.healthSummary} />
            </div>
            <div className="col-span-1">
              <AlertsPanel alerts={dashboardData?.healthSummary?.alerts} />
            </div>
          </div>

          <div className="mb-8">
            <MetricsGrid 
              salesTrend={dashboardData?.healthSummary?.salesTrend}
              stockMovement={dashboardData?.healthSummary?.stockMovement}
              activityRecency={dashboardData?.healthSummary?.activityRecency}
            />
          </div>

          <div className="mb-8">
            <FinancialSnapshot cashFlow={dashboardData?.cashFlow} />
          </div>

          {!salesTrendData ? (
            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-10 text-center text-slate-500">
              Unable to load insights
            </div>
          ) : (
            <div className="space-y-8">
              <TrendChart data={salesTrendData} />
              
              <SecondaryInsights data={salesTrendData} />
              
              <SmartActions data={salesTrendData} />
            </div>
          )}

      </div>
    </motion.div>
  );
}

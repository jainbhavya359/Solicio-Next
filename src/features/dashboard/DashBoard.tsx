"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import LedgerSearchBox from "../ledger/LedgerSearchBox";
import { useDashboardData } from "./hooks/useDashboardData";
import { sectionInfo, SectionId } from "./constants/navItems";

import DashboardSidebar from "./DashboardSidebar";
import DashboardMobileHeader, { SidebarOverlay } from "./components/DashboardMobileHeader";

import OverviewSection from "./sections/OverviewSection";
import InventorySection from "./sections/InventorySection";
import FinanceSection from "./sections/FinanceSection";
import LedgerSection from "./sections/LedgerSection";
import PartiesSection from "./sections/PartiesSection";
import LoansSection from "./sections/LoansSection";
import AlertsSection from "./sections/AlertsSection";
import SettingsSection from "./sections/SettingsSection";

export default function Dashboard() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    dashboardData, loans, setLoans,
    loadingDashboard, loadingLoans,
    salesTrendData, reload, setReload,
    fromDate, setFromDate, toDate, setToDate,
  } = useDashboardData(email || undefined);

  const current = sectionInfo[activeSection];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 flex overflow-x-hidden w-full relative selection:bg-emerald-500/30">
      {/* Global Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      
      <Toaster 
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }} 
      />

      {/* ── Layout Shell ─────────────────────────────── */}
      <DashboardMobileHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SidebarOverlay open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <DashboardSidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ── Main Content ──────────────────────────────── */}
      <main className="flex-1 min-w-0 w-full lg:ml-20 peer-hover:lg:ml-[280px] min-h-screen pt-16 lg:pt-0 [zoom:0.85] lg:[zoom:1] transition-all duration-300 ease-in-out relative z-10">

        {/* Ledger search — only visible on overview */}
        {email && activeSection === "overview" && (
          <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden">
            <LedgerSearchBox key={activeSection} email={email} />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 w-full min-w-0 flex flex-col">
          {/* Section heading */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{current.title}</h1>
            <p className="text-xs sm:text-base text-slate-400 mt-1 font-medium">{current.subtitle}</p>
          </motion.div>

          {/* Section panels */}
          <AnimatePresence mode="wait">
            {activeSection === "overview" && (
              <OverviewSection
                key="overview"
                dashboardData={dashboardData}
                salesTrendData={salesTrendData}
                loadingDashboard={loadingDashboard}
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
                onViewInventory={() => setActiveSection("inventory")}
              />
            )}
            {activeSection === "inventory" && (
              <InventorySection
                key="inventory"
                dashboardData={dashboardData}
                loadingDashboard={loadingDashboard}
                reload={reload}
                setReload={setReload}
              />
            )}
            {activeSection === "finance" && (
              <FinanceSection key="finance" dashboardData={dashboardData} />
            )}
            {activeSection === "ledger" && (
              <LedgerSection key="ledger" dashboardData={dashboardData} />
            )}
            {activeSection === "parties" && <PartiesSection key="parties" />}
            {activeSection === "loans" && (
              <LoansSection key="loans" loans={loans} loadingLoans={loadingLoans} setLoans={setLoans} />
            )}
            {activeSection === "alerts" && email && (
              <AlertsSection key="alerts" dashboardData={dashboardData} email={email} />
            )}
            {activeSection === "settings" && email && (
              <SettingsSection key="settings" email={email} />
            )}
          </AnimatePresence>

          <div className="h-4 sm:h-8" />
        </div>
      </main>
    </div>
  );
}

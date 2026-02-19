"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { UserButton, useUser, SignOutButton, UserProfile } from "@clerk/nextjs";

// Existing components - keeping for functionality
import { CreditGauge } from "../../components/Loan";
import { useCreditStore } from "../../store/useCreditStore";
import LedgerSearchBox from "../ledger/LedgerSearchBox";
import StockReport from "../stock/StockReport";
import LedgerEntries from "../ledger/LedgerEntries";
import ProfitLossReport from "../stock/ProfitLossReport";
import StockValuation from "../stock/StockValuation";
import StockAlertSmart from "../Insights/StockAlert";
import CashFlowWatch from "../Insights/CashFlow";
import AlertsFeed from "../alerts/AlertsFeed";
import License_Report from "../loan_licenses/License_Report";
import BusinessHealthCard from "../health/BusinessHealthCard";
import SlowMovingStockContainer from "../Insights/SlowMovingStockContainer";
import { ActionSuggestionCard, ForecastSummaryCard, MarginTrendGraph, SalesTrendGraphCard, TopProductDonut } from "../Insights/SalesTrendInsightsCard";
import KPICards from "./KPICards";
import TopProductsCard from "../Insights/TopProductCard";
import Purchase from "../stock/Purchase";
import Sale from "../stock/Sale";
import { Toaster } from "react-hot-toast";
import { fetchDashboardData } from "@/src/lib/api/dashboard";


// Icons as inline SVGs
const Icons = {
  logo: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  overview: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  inventory: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
    </svg>
  ),
  finance: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
    </svg>
  ),
  ledger: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="M8 11h8" /><path d="M8 7h6" />
    </svg>
  ),
  loans: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  alerts: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
  ),
  chevronRight: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  signOut: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  ),
  menu: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  ),
  close: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
  ),
  calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
    </svg>
  ),
  trash: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
  features: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
};


import ActiveLoans, { Loan } from "../loan_licenses/ActiveLoans";



// Animation variants
const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

// Navigation Items
const navItems = [
  { id: "overview", label: "Overview", icon: Icons.overview },
  { id: "inventory", label: "Inventory", icon: Icons.inventory },
  { id: "finance", label: "Finance", icon: Icons.finance },
  { id: "ledger", label: "Ledger", icon: Icons.ledger },
  { id: "loans", label: "Loans", icon: Icons.loans },
  { id: "alerts", label: "Alerts", icon: Icons.alerts },
  { id: "settings", label: "Settings", icon: Icons.settings },
];

const PanelMotion = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 12 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);


export default function Dashboard() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const { score, show } = useCreditStore();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newPurchase, setNewPurchase] = useState(false);
  const [newSale, setNewSale] = useState(false);
  const [reload, setReload] = useState(false);
  const [product, setProduct] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Date filters
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);


  const [data, setData] = useState<any | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(true);


  useEffect(() => {
    if (!email) return;

    const load = async () => {
      setLoadingDashboard(true);
      try {
        const data = await fetchDashboardData(email, fromDate, toDate);
        setDashboardData(data);
        setLoans(data.loans);
        setData(data.salesTrend7);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDashboard(false);
        setLoadingInsights(false);
        setLoadingLoans(false);
      }
    };

    load();
  }, [email, reload, fromDate, toDate]);


  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };




  // Section titles and subtitles
  const sectionInfo: Record<string, { title: string; subtitle: string }> = {
    overview: { title: "Business Overview", subtitle: "High-level snapshot of your business" },
    inventory: { title: "Inventory", subtitle: "Stock levels, valuation & alerts" },
    finance: { title: "Finance", subtitle: "Profitability & cash movement" },
    ledger: { title: "Ledger", subtitle: "Purchase & sales history" },
    loans: { title: "Loans & Licenses", subtitle: "Active loans & lending profile" },
    alerts: { title: "Alerts & Insights", subtitle: "System-generated recommendations" },
    settings: { title: "Settings", subtitle: "Manage your account preferences" },
  };

  const card =
    "bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-transparent";

  return (
    <div className="min-h-screen bg-[#F7FAF9] flex overflow-x-hidden w-full">
      <Toaster />

      {/* Mobile Header */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 ${card}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              {Icons.logo}
            </div>
            <span className="font-semibold text-stone-900">Solicio</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
          >
            {sidebarOpen ? Icons.close : Icons.menu}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] lg:w-[280px] bg-white border-r border-slate-200 flex flex-col
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:z-30 shadow-2xl lg:shadow-none`}
      >
        {/* Sidebar Header */}
        <div className="p-6 lg:p-8">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200"
            >
              {Icons.logo}
            </motion.div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-lg lg:text-xl tracking-tight">Solicio</h1>
              <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Command Center</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 lg:px-4 mt-2 overflow-y-auto">
          <p className="px-4 mb-2 lg:mb-3 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menu Navigation</p>
          <div className="space-y-1 lg:space-y-1.5">
            <motion.a
              href="/"
              className="w-full flex items-center justify-between px-4 py-2.5 lg:py-3 rounded-2xl transition-all duration-200 text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 hover:text-emerald-600"
              whileHover={{ x: 2 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🏚️</span>
                <span className="font-bold text-sm">Main Landing</span>
              </div>
            </motion.a>
            <motion.a
              href="/features"
              className="w-full flex items-center justify-between px-4 py-2.5 lg:py-3 rounded-2xl transition-all duration-200 text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100"
              whileHover={{ x: 2 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-500">{Icons.features}</span>
                <span className="font-bold text-sm">Product Features</span>
              </div>
            </motion.a>

            <div className="h-3 lg:h-4" />
            <p className="px-4 mb-2 lg:mb-3 text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Insights & Control</p>

            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                whileHover={{ x: activeSection === item.id ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-between px-4 py-2.5 lg:py-3 rounded-2xl text-left transition-all duration-200
                  ${activeSection === item.id
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                    : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={activeSection === item.id ? "text-emerald-400" : "text-slate-400"}>
                    {item.icon}
                  </span>
                  <span className="font-bold text-sm">{item.label}</span>
                </div>
                {activeSection === item.id && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-white/40"
                  >
                    {Icons.chevronRight}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-3 lg:p-4">
          <div className="bg-slate-50 rounded-3xl p-2 border border-slate-100">
            <div className="flex items-center gap-3 p-2 lg:p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                {user?.firstName?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user?.fullName || "User"}
                </p>
                <p className="text-[10px] font-medium text-slate-400 truncate tracking-tight">{email}</p>
              </div>
            </div>
            <SignOutButton>
              <button className="w-full mt-2 flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                {Icons.signOut}
                <span className="text-xs font-bold uppercase tracking-widest">Sign out</span>
              </button>
            </SignOutButton>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] min-h-screen pt-16 lg:pt-0 [zoom:0.85] lg:[zoom:1]">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden">
          {email && <LedgerSearchBox key={activeSection} email={email} />}
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              {sectionInfo[activeSection]?.title || "Dashboard"}
            </h1>
            <p className="text-xs sm:text-base text-stone-500 mt-1">
              {sectionInfo[activeSection]?.subtitle || "Manage your business"}
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6 sm:space-y-8">
            {/* OVERVIEW SECTION */}
            {activeSection === "overview" && (
              <section id="overview">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Date Filter Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        {Icons.calendar}
                      </div>
                      <h2 className="text-sm font-semibold text-stone-700">Filter Range</h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 flex-1 sm:flex-none">
                        <span className="text-xs font-medium text-stone-400">From</span>
                        <input
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-stone-50 border-none text-sm font-medium text-stone-700 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2 flex-1 sm:flex-none">
                        <span className="text-xs font-medium text-stone-400">To</span>
                        <input
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-stone-50 border-none text-sm font-medium text-stone-700 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Health & KPIs */}
                  <div className="space-y-4 sm:space-y-8">
                    <KPICards data={dashboardData?.kpis} />
                    {email && <BusinessHealthCard data={dashboardData?.healthSummary} />}
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <motion.div variants={fadeInUp} className="h-full">
                      <CreditGauge score={score} />
                    </motion.div>

                    <motion.div variants={fadeInUp} className="h-full">
                      <CashFlowWatch data={dashboardData?.cashFlow} />
                    </motion.div>
                  </div>
                  {loadingInsights ? (
                    <div className="bg-white rounded-2xl p-10 shadow-sm flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full"
                      />
                    </div>
                  ) : !data ? (
                    <div className="bg-white rounded-2xl p-10 text-center text-stone-500">
                      Unable to load insights
                    </div>
                  ) : (
                    <section className="mx-auto max-w-7xl px-0 sm:px-4 py-8 sm:py-20 space-y-6 sm:space-y-10">
                      {/* 1️⃣ Sales Trend (hero insight) */}
                      <SalesTrendGraphCard data={data} />

                      {/* 2️⃣ Forward-looking */}
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <ForecastSummaryCard data={data} />
                      </div>

                      {/* 4️⃣ Context */}
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <TopProductDonut data={data} onViewInventory={() => scrollToSection("inventory")} />
                        <MarginTrendGraph data={data} />
                      </div>

                      {/* 5️⃣ Advice */}
                      <ActionSuggestionCard data={data} />
                    </section>
                  )}

                </motion.div>
              </section>
            )}

            {/* INVENTORY SECTION */}
            {activeSection === "inventory" && (
              <section id="inventory">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-4 sm:space-y-6"
                >
                  <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
                    <StockReport
                      visible={true}
                      data={dashboardData?.inventory}
                      productSetter={setProduct}
                      saleSetter={setNewSale}
                      purchaseSetter={setNewPurchase}
                    />
                  </motion.div>
                  {/* FORMS */}
                  <AnimatePresence mode="wait">
                    {newPurchase && (
                      <PanelMotion key="purchase">
                        <Purchase
                          visible={true}
                          preSelectedProduct={product}
                          reloadSetter={setReload}
                          reload={reload}
                        />
                      </PanelMotion>
                    )}

                    {newSale && (
                      <PanelMotion key="sale">
                        <Sale
                          visible={true}
                          preSelectedProduct={product}
                          reloadSetter={setReload}
                          reload={reload}
                        />
                      </PanelMotion>
                    )}
                  </AnimatePresence>
                  <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
                    <TopProductsCard />
                  </motion.div>
                  <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
                    <StockAlertSmart data={dashboardData?.lowStock} />
                  </motion.div>
                  <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
                    <StockValuation />
                  </motion.div>
                </motion.div>
              </section>
            )}

            {/* FINANCE SECTION */}
            {activeSection === "finance" && (
              <section id="finance">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-4 sm:space-y-6"
                >
                  <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
                    <ProfitLossReport />
                  </motion.div>
                  <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
                    <CashFlowWatch data={dashboardData?.cashFlow} />
                  </motion.div>
                </motion.div>
              </section>
            )}

            {/* LEDGER SECTION */}
            {activeSection === "ledger" && (
              <section id="ledger">
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
                </motion.div>
              </section>
            )}

            {/* LOANS SECTION */}
            {activeSection === "loans" && (
              <section id="loans">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-4 sm:space-y-6"
                >
                  <ActiveLoans data={loans} loading={loadingLoans} setLoans={setLoans} />

                  {/* Licenses */}
                  <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
                    <License_Report />
                  </motion.div>
                </motion.div>
              </section>
            )}

            {/* ALERTS & INSIGHTS SECTION */}
            {activeSection === "alerts" && (
              <section id="alerts">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-4 sm:space-y-6"
                >
                  <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
                    <SlowMovingStockContainer data={dashboardData?.slowMoving} />
                  </motion.div>
                  <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm">
                    {email && <AlertsFeed email={email} />}
                  </motion.div>
                </motion.div>
              </section>
            )}

            {/* SETTINGS SECTION */}
            {activeSection === "settings" && (
              <section id="settings">
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-sm"
                >
                  <UserProfile routing="hash" />
                </motion.div>
              </section>
            )}
          </div>

          {/* Footer Spacer */}
          <div className="h-4 sm:h-8" />
        </div>
      </main>
    </div>
  );
}

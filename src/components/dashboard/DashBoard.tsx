"use client";

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, useUser, SignOutButton, UserProfile } from "@clerk/nextjs";

// Existing components - keeping for functionality
import { CreditGauge } from "../Loan";
import { useCreditStore } from "../../store/useCreditStore";
import LedgerSearchBox from "../LedgerSearchBox";
import StockReport from "../stockRelated/StockReport";
import LedgerEntries from "../LedgerEntries";
import ProfitLossReport from "../stockRelated/ProfitLossReoprt";
import StockValuation from "../stockRelated/StockValuation";
import StockAlertSmart from "../Insights/StockAlert";
import CashFlowWatch from "../Insights/CashFlow";
import AlertsFeed from "../alerts/AlertsFeed";
import License_Report from "../License_Report";
import BusinessHealthCard from "../health/BusinessHealthCard";
import SlowMovingStockContainer from "../Insights/SlowMovingStockContainer";
import { ActionSuggestionCard, ForecastSummaryCard, MarginTrendGraph, SalesTrendGraphCard, TopProductDonut } from "../Insights/SalesTrendInsightsCard";
import KPICards from "./KPICards";
import TopProductsCard from "../Insights/TopProductCard";
import Purchase from "../Purchase";
import Sale from "../Sale";
import { Toaster } from "react-hot-toast";

// Icons as inline SVGs
const Icons = {
  logo: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  overview: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  inventory: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
  ),
  finance: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
    </svg>
  ),
  ledger: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 11h8"/><path d="M8 7h6"/>
    </svg>
  ),
  loans: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
    </svg>
  ),
  alerts: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  chevronRight: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
  signOut: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
  ),
  menu: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
    </svg>
  ),
  close: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  ),
  calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
    </svg>
  ),
  trash: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    </svg>
  ),
};

const formatMoney = (value: number | undefined | null) => {
  if (typeof value !== "number") return "—";
  return `₹${value.toLocaleString()}`;
};

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

const daysUntil = (date: string | undefined | null) => {
  if (!date) return undefined;
  const now = new Date();
  const target = new Date(date);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

interface Loan {
  _id: string;
  loanType?: string;
  lender?: string;
  status: "active" | "overdue" | "closed";
  emiAmount?: number;
  principalAmount?: number;
  tenure?: number;
  tenureUnit?: string;
  interestRate?: number;
  nextDueDate?: string;
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const staggerContainer = {
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

// Premium Loan Status Badge
function LoanStatusBadge({ status }: { status: "active" | "overdue" | "closed" }) {
  const styles = {
    active: "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200/60 shadow-sm",
    overdue: "bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border-red-200/60 shadow-sm",
    closed: "bg-gradient-to-r from-slate-50 to-zinc-50 text-slate-600 border-slate-200/60 shadow-sm",
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${styles[status]} transition-all duration-200`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

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

  const [data, setData] = useState<any | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(true);


  useEffect(() => {
    if (!email) return;
    axios
      .get("/api/loans", { params: { email } })
      .then((res) => setLoans(res.data))
      .finally(() => setLoadingLoans(false));

    const FetchData = async () => {
      try {
        setLoadingInsights(true);
        const res = await axios.get("/api/insights/sales-trend", {
          params: { email, days: 7 },
        });

        if (res.status === 200) {
          setData(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingInsights(false);
      }
    };


    FetchData();
  }, [email, reload]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };


  const handleDeleteLoan = async (loanId: string) => {
    const ok = confirm("Are you sure you want to remove this loan?");
    if (!ok) return;
    await fetch(`/api/loans?id=${loanId}`, { method: "DELETE" });
    setLoans((prev) => prev.filter((l) => l._id !== loanId));
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
  "bg-white/80 backdrop-blur-sm rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 border border-slate-200/60";

  return (
    <div className="min-h-screen bg-zinc-50 pattern-dots flex">
      <Toaster />

      {/* Mobile Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 ${card} backdrop-blur-md`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-header flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              {Icons.logo}
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base">Solicio</span>
              <p className="text-xs text-slate-500">Enterprise</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all duration-200"
          >
            {sidebarOpen ? Icons.close : Icons.menu}
          </button>
        </div>
      </motion.header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Premium Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-white border-r border-slate-200/60 flex flex-col
          transform transition-transform duration-300 ease-out shadow-premium-lg
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:z-30`}
      >
        {/* Sidebar Header with Gradient */}
        <div className="p-6 gradient-header relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 backdrop-blur-3xl"></div>
          <div className="relative flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg border border-white/30"
            >
              {Icons.logo}
            </motion.div>
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight">Solicio</h1>
              <p className="text-xs text-indigo-100">Enterprise Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <p className="px-4 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</p>
          <div className="space-y-1">
            <motion.a
              href="/"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="font-medium text-sm">Home</span>
            </motion.a>
            {navItems.map((item, idx) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ x: activeSection === item.id ? 0 : 3 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                  ${activeSection === item.id
                    ? "gradient-card text-white shadow-lg shadow-indigo-500/30"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <span className={activeSection === item.id ? "text-white" : "text-slate-500"}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.label}</span>
                {activeSection === item.id && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-200/60">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-indigo-500/30">
              {user?.firstName?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">{email}</p>
            </div>
          </div>
          <SignOutButton>
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full mt-3 flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
            >
              {Icons.signOut}
              <span className="text-sm font-medium">Sign out</span>
            </motion.button>
          </SignOutButton>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] min-h-screen pt-16 lg:pt-0">
        {/* Premium Top Bar */}
        <div className="sticky top-16 lg:top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            {email && <LedgerSearchBox email={email} />}
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Premium Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-violet-600 rounded-full"></div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {sectionInfo[activeSection]?.title || "Dashboard"}
              </h1>
            </div>
            <p className="text-slate-500 text-base ml-8">
              {sectionInfo[activeSection]?.subtitle || "Manage your business"}
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
            {/* OVERVIEW SECTION */}
            {activeSection === "overview" && (
            <section id="overview">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Premium KPI Section */}
                <motion.div variants={fadeInUp}>
                  <KPICards />
                </motion.div>

                {/* Premium Business Health Card */}
                <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium">
                  {email && <BusinessHealthCard email={email} />}
                </motion.div>

                {/* Two Column Premium Layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {(
                    <motion.div 
                      variants={fadeInUp} 
                      whileHover={{ y: -2 }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                    >
                      <CreditGauge score={score} />
                    </motion.div>
                  )}
                  <motion.div 
                    variants={fadeInUp}
                    whileHover={{ y: -2 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                  >
                    <CashFlowWatch />
                  </motion.div>
                </div>
                {loadingInsights ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-16 shadow-premium flex flex-col items-center justify-center gap-4"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full"
                    />
                    <p className="text-slate-500 text-sm font-medium">Loading insights...</p>
                  </motion.div>
                ) : !data ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-16 text-center"
                  >
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                          <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                        </svg>
                      </div>
                      <p className="text-slate-500 font-medium">Unable to load insights</p>
                      <p className="text-slate-400 text-sm mt-2">Please try again later</p>
                    </div>
                  </motion.div>
                ) : (
                  <section className="mx-auto max-w-7xl px-4 py-20 space-y-10">
                    {/* 1️⃣ Sales Trend (hero insight) */}
                    <SalesTrendGraphCard data={data} />
        
                    {/* 2️⃣ Forward-looking */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <ForecastSummaryCard data={data} />
                    </div>
        
                    {/* 4️⃣ Context */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <TopProductDonut data={data} />
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
                animate="visible"
                className="space-y-6"
              >
                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
                  <StockReport visible={true} reload={reload} productSetter={setProduct} saleSetter={setNewSale} purchaseSetter={setNewPurchase}/>
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
                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
                  <TopProductsCard />
                </motion.div>
                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
                  <StockAlertSmart />
                </motion.div>
                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
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
                animate="visible"
                className="space-y-6"
              >
                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
                  <ProfitLossReport />
                </motion.div>
                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
                  <CashFlowWatch />
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
                animate="visible"
                className="space-y-6"
              >
                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
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
                animate="visible"
                className="space-y-6"
              >
                {loadingLoans ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-16 shadow-premium flex flex-col items-center justify-center gap-4"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full"
                    />
                    <p className="text-slate-500 text-sm font-medium">Loading loans...</p>
                  </motion.div>
                ) : loans.length === 0 ? (
                  <motion.div 
                    variants={fadeInUp} 
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-16 shadow-premium text-center"
                  >
                    <div className="max-w-md mx-auto">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center text-indigo-400">
                        {Icons.loans}
                      </div>
                      <p className="text-slate-700 font-semibold text-lg mb-2">No active loans</p>
                      <p className="text-slate-500 text-sm">Your loan portfolio will appear here once added</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {loans.map((loan) => {
                      const daysLeft = daysUntil(loan.nextDueDate);

                      return (
                        <motion.div
                          key={loan._id}
                          variants={fadeInUp}
                          whileHover={{ y: -4, transition: { duration: 0.3 } }}
                          className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-7 shadow-premium hover:shadow-premium-lg transition-all duration-300 overflow-hidden"
                        >
                          {/* Gradient accent on hover */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Header */}
                          <div className="flex justify-between items-start mb-5">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-600">
                                {Icons.loans}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 text-base">
                                  {loan.loanType || "Loan"}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {loan.lender || "—"}
                                </p>
                              </div>
                            </div>
                            <LoanStatusBadge status={loan.status} />
                          </div>

                          {/* EMI - Prominent Display */}
                          <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60">
                            <p className="text-emerald-700 font-bold text-3xl tracking-tight">
                              {formatMoney(loan.emiAmount)}
                            </p>
                            <p className="text-xs text-emerald-600 font-medium mt-1 uppercase tracking-wide">Monthly EMI</p>
                          </div>

                          {/* Meta - Enhanced Spacing */}
                          <div className="space-y-3 text-sm mb-5">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                              <span className="text-slate-500 font-medium">Principal</span>
                              <span className="text-slate-900 font-bold">
                                {formatMoney(loan.principalAmount)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                              <span className="text-slate-500 font-medium">Tenure</span>
                              <span className="text-slate-900 font-bold">
                                {loan.tenure} {loan.tenureUnit} @ {loan.interestRate}%
                              </span>
                            </div>
                          </div>

                          {/* Premium Due Date Badge */}
                          {loan.status === "active" && daysLeft !== undefined && (
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={`text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-2 font-semibold shadow-sm
                                ${daysLeft <= 0
                                  ? "bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border border-red-200/60"
                                  : daysLeft <= 7
                                  ? "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200/60"
                                  : "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/60"
                                }`}
                            >
                              {Icons.calendar}
                              {daysLeft <= 0
                                ? "EMI due today"
                                : `Next EMI in ${daysLeft} days`}
                            </motion.div>
                          )}

                          {/* Premium Actions */}
                          {loan.status !== "closed" && (
                            <div className="mt-5 pt-5 border-t border-slate-100 flex justify-end">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDeleteLoan(loan._id)}
                                className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium border border-transparent hover:border-red-200"
                              >
                                {Icons.trash}
                                Remove loan
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Premium Licenses Card */}
                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
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
                animate="visible"
                className="space-y-6"
              >
                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
                  <SlowMovingStockContainer />
                </motion.div>
                <motion.div 
                  variants={fadeInUp}
                  whileHover={{ y: -2 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300"
                >
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
                animate="visible"
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-8 shadow-premium"
              >
                <UserProfile />
              </motion.div>
            </section>
            )}
          </div>

          {/* Premium Footer Spacer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="h-16 flex items-center justify-center text-slate-400 text-sm font-medium"
          >
            <p>Solicio Enterprise Platform</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

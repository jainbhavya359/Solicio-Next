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

// Loan Status Badge
function LoanStatusBadge({ status }: { status: "active" | "overdue" | "closed" }) {
  const styles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    overdue: "bg-red-50 text-red-700 border-red-200",
    closed: "bg-stone-100 text-stone-600 border-stone-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
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
  "bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-transparent";

  return (
    <div className="min-h-screen bg-[#F7FAF9] flex">
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
        className={`fixed top-0 left-0 z-50 h-full w-[280px] ${card} flex flex-col
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:z-30`}
      >
        {/* Sidebar Header */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
            >
              {Icons.logo}
            </motion.div>
            <div>
              <h1 className="font-bold text-stone-900 text-lg">Solicio</h1>
              <p className="text-xs text-stone-500">Business Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <p className="px-3 mb-3 text-xs font-semibold text-stone-400 uppercase tracking-wider">Menu</p>
          <div className="space-y-1">
            <motion.a
              href="/"
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-stone-500">🏚️</span>
                <span className="font-medium text-sm">Home</span>
              </div>
            </motion.a>
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                whileHover={{ x: activeSection === item.id ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200
                  ${activeSection === item.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-stone-600 hover:bg-stone-100"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={activeSection === item.id ? "text-white" : "text-stone-500"}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {activeSection === item.id && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-white"
                  >
                    {Icons.chevronRight}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className={`p-4 ${card}`}>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
              {user?.firstName?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-900 truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-stone-500 truncate">{email}</p>
            </div>
          </div>
          <SignOutButton>
            <button className="w-full mt-3 flex items-center gap-3 px-4 py-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors">
              {Icons.signOut}
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] min-h-screen pt-16 lg:pt-0">
        {/* Top Header Bar */}
        <div className="p-6 w-13/14 place-self-center">
          {email && <LedgerSearchBox email={email} />}
        </div>

        {/* Page Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-stone-900">
              {sectionInfo[activeSection]?.title || "Dashboard"}
            </h1>
            <p className="text-stone-500 mt-1">
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
                {/* Business Health Card */}
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <div className="pb-6">
                    <KPICards />
                  </div>
                  {email && <BusinessHealthCard email={email} />}
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {(
                    <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                      <CreditGauge score={score} />
                    </motion.div>
                  )}
                  <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                    <CashFlowWatch />
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
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-6"
              >
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
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
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <TopProductsCard />
                </motion.div>
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <StockAlertSmart />
                </motion.div>
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
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
                className="space-y-6"
              >
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <ProfitLossReport />
                </motion.div>
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
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
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-6"
              >
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
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
                className="space-y-6"
              >
                {loadingLoans ? (
                  <div className="bg-white rounded-2xl border border-stone-200 p-12 shadow-sm flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-2 border-emerald-200 border-t-emerald-600 rounded-full"
                    />
                  </div>
                ) : loans.length === 0 ? (
                  <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-12 shadow-sm text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400">
                      {Icons.loans}
                    </div>
                    <p className="text-stone-500">No active loans found</p>
                  </motion.div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {loans.map((loan) => {
                      const daysLeft = daysUntil(loan.nextDueDate);

                      return (
                        <motion.div
                          key={loan._id}
                          variants={fadeInUp}
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300"
                        >
                          {/* Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-semibold text-stone-900">
                                {loan.loanType || "Loan"}
                              </p>
                              <p className="text-sm text-stone-500">
                                {loan.lender || "—"}
                              </p>
                            </div>
                            <LoanStatusBadge status={loan.status} />
                          </div>

                          {/* EMI */}
                          <div className="mb-4">
                            <p className="text-emerald-700 font-bold text-2xl">
                              {formatMoney(loan.emiAmount)}
                            </p>
                            <p className="text-xs text-stone-500 mt-1">Monthly EMI</p>
                          </div>

                          {/* Meta */}
                          <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                              <span className="text-stone-500">Principal</span>
                              <span className="text-stone-900 font-medium">
                                {formatMoney(loan.principalAmount)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Tenure</span>
                              <span className="text-stone-900 font-medium">
                                {loan.tenure} {loan.tenureUnit} @ {loan.interestRate}%
                              </span>
                            </div>
                          </div>

                          {/* Due Date Badge */}
                          {loan.status === "active" && daysLeft !== undefined && (
                            <div
                              className={`text-xs px-3 py-2 rounded-lg inline-flex items-center gap-2 font-medium
                                ${daysLeft <= 0
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : daysLeft <= 7
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                }`}
                            >
                              {Icons.calendar}
                              {daysLeft <= 0
                                ? "EMI due today"
                                : `Next EMI in ${daysLeft} days`}
                            </div>
                          )}

                          {/* Actions */}
                          {loan.status !== "closed" && (
                            <div className="mt-4 pt-4 border-t border-stone-100 flex justify-end">
                              <button
                                onClick={() => handleDeleteLoan(loan._id)}
                                className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                              >
                                {Icons.trash}
                                Remove loan
                              </button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Licenses */}
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
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
                className="space-y-6"
              >
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
                  <SlowMovingStockContainer />
                </motion.div>
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
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
                className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm"
              >
                <UserProfile />
              </motion.div>
            </section>
            )}
          </div>

          {/* Footer Spacer */}
          <div className="h-8" />
        </div>
      </main>
    </div>
  );
}

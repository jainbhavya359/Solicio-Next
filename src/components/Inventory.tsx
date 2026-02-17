"use client";

import { useState, useEffect } from "react";
import { fetchInventorySnapshot } from "@/src/lib/api/inventory";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { Package, Activity, Sparkles, Layout, ChevronRight, Zap, TrendingUp } from "lucide-react";

import Purchase from "../features/stock/Purchase";
import Sale from "../features/stock/Sale";
import StockReport from "../features/stock/StockReport";
import StockAlertSmart from "../features/Insights/StockAlert";
import StockHistory from "../features/stock/StockHistory";
import ProfitLossReport from "../features/stock/ProfitLossReoprt";

const PanelMotion = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
  >
    {children}
  </motion.div>
);

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<"report" | "purchase" | "sale">("report");
  const [reload, setReload] = useState(false);
  const [product, setProduct] = useState("");

  const [snapshot, setSnapshot] = useState<any>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(true);

  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (!email) return;

    const load = async () => {
      setLoadingSnapshot(true);
      try {
        const data = await fetchInventorySnapshot(email);
        setSnapshot(data);
      } catch (err) {
        console.error("Inventory snapshot failed", err);
      } finally {
        setLoadingSnapshot(false);
      }
    };

    load();
  }, [email, reload]);

  // Compatibility helpers for nested components
  const setNewPurchase = (v: boolean) => v && setActiveTab("purchase");
  const setNewSale = (v: boolean) => v && setActiveTab("sale");

  return (
    <section className="bg-white min-h-screen relative overflow-hidden flex flex-col items-center font-outfit">
      {/* Background radial grid */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <Toaster />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 space-y-24">

        {/* HERO HEADER - StockReport/Homepage Alignment */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-widest mb-6 border border-slate-200/50">
            <Package className="w-3 h-3 text-emerald-600" />
            Logistics Analysis Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tightest leading-none">
            Inventory <span className="text-emerald-600">& Operations</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-slate-500 leading-relaxed font-medium max-w-3xl">
            Unified logistics control center for tactical stock monitoring, high-velocity procurement, and capital deployment tracking.
          </p>
        </motion.div>

        {/* STRATEGIC COMMAND CENTER - Action Bar */}
        <div className="sticky bottom-8 z-50 flex justify-center w-full pointer-events-none">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-2.5 shadow-2xl flex items-center gap-2 pointer-events-auto"
          >
            <ActionButton
              active={activeTab === "purchase"}
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => setActiveTab("purchase")}
            >
              Dispatch Purchase
            </ActionButton>

            <ActionButton
              active={activeTab === "sale"}
              icon={<Zap className="w-4 h-4" />}
              onClick={() => setActiveTab("sale")}
            >
              Execute Sale
            </ActionButton>

            <div className="w-px h-8 bg-white/10 mx-1" />

            <ActionButton
              variant="secondary"
              active={activeTab === "report"}
              icon={<Layout className="w-4 h-4" />}
              onClick={() => setActiveTab("report")}
            >
              Inventory Report
            </ActionButton>
          </motion.div>
        </div>

        {/* TACTICAL PANELS */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === "purchase" && (
              <PanelMotion key="purchase">
                <div className="w-full">
                  <Purchase
                    visible={true}
                    preSelectedProduct={product}
                    reloadSetter={() => setReload(!reload)}
                    reload={reload}
                  />
                </div>
              </PanelMotion>
            )}

            {activeTab === "sale" && (
              <PanelMotion key="sale">
                <div className="w-full">
                  <Sale
                    visible={true}
                    preSelectedProduct={product}
                    reloadSetter={() => setReload(!reload)}
                    reload={reload}
                  />
                </div>
              </PanelMotion>
            )}

            {activeTab === "report" && (
              <PanelMotion key="report">
                <div className="space-y-24">
                  {/* MAIN STOCK REPORT */}
                  <StockReport
                    visible={true}
                    data={snapshot?.inventory}
                    productSetter={setProduct}
                    purchaseSetter={setNewPurchase}
                    saleSetter={setNewSale}
                    reloadKey={reload ? 1 : 0}
                  />

                  {/* HIGH-VISIBILITY INSIGHTS STACK - BusinessInsights Alignment */}
                  <section className="space-y-16">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap px-1">Tactical Analysis Stack</span>
                      <div className="h-px w-full bg-slate-100" />
                    </div>

                    <div className="grid grid-cols-1 gap-12">
                      <StockAlertSmart data={snapshot?.lowStock} />
                      <StockHistory data={snapshot?.stockHistory} />
                      <ProfitLossReport />
                    </div>
                  </section>
                </div>
              </PanelMotion>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER STATS SLIVER */}
        <div className="pt-20 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 opacity-50">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Inventory Synchronicity: Nominal</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Solicio Tactical Edge v2.0</p>
        </div>

      </div>
    </section>
  );
}

/* ---------- UI Components ---------- */

function ActionButton({
  children,
  onClick,
  icon,
  active = false,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
  active?: boolean;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2.5 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300
        ${active
          ? variant === "primary" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40" : "bg-white text-slate-900 shadow-lg shadow-white/20"
          : "text-slate-400 hover:text-white hover:bg-white/5"
        }
      `}
    >
      {icon && <span className={`${active ? "opacity-100 animate-pulse" : "opacity-50"}`}>{icon}</span>}
      {children}
    </button>
  );
}

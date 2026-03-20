"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { fetchInventorySnapshot } from "@/src/lib/api/inventory";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

import Purchase from "../features/stock/Purchase";
import Sale from "../features/stock/Sale";
import StockReport from "../features/stock/StockReport";
import StockAlertSmart from "../features/Insights/StockAlert";
import StockHistory from "../features/stock/StockHistory";
import ProfitLossReport from "../features/stock/ProfitLossReport";
import FinancialReport from "../features/stock/FinancialReport";

// PREMIUM COMPONENTS
import InventoryHero from "./Inventory/InventoryHero";
import InventoryActionBar from "./Inventory/InventoryActionBar";
import AIInsightPanel from "./Insights/AIInsightPanel";
import CollapsibleSection from "./Inventory/CollapsibleSection";

const PanelMotion = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="w-full relative z-10"
  >
    {children}
  </motion.div>
);

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<"report" | "purchase" | "sale">("report");
  const [showFinancialModal, setShowFinancialModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [product, setProduct] = useState("");
  const [snapshot, setSnapshot] = useState<any>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(true);

  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const searchParams = useSearchParams();

  useEffect(() => {
    const action = searchParams.get("action");
    const preSelectedProduct = searchParams.get("product");
    if (action === "sale") setActiveTab("sale");
    else if (action === "purchase") setActiveTab("purchase");
    if (preSelectedProduct) setProduct(preSelectedProduct);
  }, [searchParams]);

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

  const setNewPurchase = (v: boolean) => v && setActiveTab("purchase");
  const setNewSale = (v: boolean) => v && setActiveTab("sale");

  // Single contextual AI insight — informed by real alert data
  const criticalCount = snapshot?.lowStock?.length ?? 0;
  const insightText = criticalCount > 0
    ? `⚠️ ${criticalCount} item${criticalCount > 1 ? "s" : ""} need immediate restocking. Review the alerts above and dispatch a purchase to prevent revenue loss.`
    : "All inventory levels are within healthy bounds. No critical stock alerts detected in the current cycle.";

  return (
    <section className="w-full bg-[#050505] min-h-screen relative overflow-hidden flex flex-col items-center">
      <Toaster />

      {/* ─── HERO: Only show on the Report tab ────────────── */}
      {activeTab === "report" && (
        <InventoryHero summary={snapshot?.inventory?.summary} loading={loadingSnapshot} />
      )}

      {/* ─── COMPACT TOP-BAR: Show on action tabs ─────────── */}
      {activeTab !== "report" && (
        <div className="w-full pt-24 pb-6 px-4 sm:px-6 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              {activeTab === "purchase" ? "Dispatch Purchase" : "Execute Sale"}
            </span>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 pb-28">
        <div className="relative w-full">
          <AnimatePresence mode="wait">

            {/* ── ACTION PANELS ──────────────────────────── */}
            {activeTab === "purchase" && (
              <PanelMotion key="purchase">
                <Purchase
                  visible={true}
                  preSelectedProduct={product}
                  reloadSetter={() => setReload(!reload)}
                  reload={reload}
                />
              </PanelMotion>
            )}

            {activeTab === "sale" && (
              <PanelMotion key="sale">
                <Sale
                  visible={true}
                  preSelectedProduct={product}
                  reloadSetter={() => setReload(!reload)}
                  reload={reload}
                />
              </PanelMotion>
            )}

            {activeTab === "report" && (
              <PanelMotion key="report">
                <div className="flex flex-col w-full space-y-10">

                  {/* ─── LAYER 2: ALERTS ───────────────────────── */}
                  {/* Show problems first — operator needs to act on these ASAP */}
                  {criticalCount > 0 && (
                    <div className="w-full">
                      <StockAlertSmart data={snapshot.lowStock} />
                    </div>
                  )}

                  {/* ─── LAYER 3: SINGLE CONTEXTUAL INSIGHT ─────── */}
                  {/* One focused message — alerts or all-clear, never redundant */}
                  <AIInsightPanel text={insightText} />

                  {/* ─── LAYER 4: STOCK TABLE ─────────────────────── */}
                  {/* Primary data — risk-sorted by default (dead → warning → slow → fast) */}
                  <div className="w-full">
                    <StockReport
                      visible={true}
                      data={snapshot?.inventory}
                      productSetter={setProduct}
                      purchaseSetter={setNewPurchase}
                      saleSetter={setNewSale}
                      reloadKey={reload ? 1 : 0}
                      reloadSetter={() => setReload(!reload)}
                    />
                  </div>

                  {/* ─── LAYER 5: MOVEMENT (COLLAPSIBLE) ─────────── */}
                  {/* Secondary data — collapsed by default to reduce first-load noise */}
                  <CollapsibleSection
                    title="Fiscal Manifest"
                    subtitle="Inbound acquisitions & outbound deployments"
                    badge={snapshot?.stockHistory?.length ? `${snapshot.stockHistory.length} entries` : undefined}
                    defaultOpen={false}
                  >
                    <StockHistory data={snapshot?.stockHistory} />
                  </CollapsibleSection>

                  {/* ─── LAYER 6: FINANCIALS (COLLAPSIBLE) ───────── */}
                  {/* Reference data — shown only when operator explicitly needs it */}
                  <CollapsibleSection
                    title="Profit & Loss Statement"
                    subtitle="Revenue, costs, and net profit for the period"
                    defaultOpen={false}
                  >
                    <ProfitLossReport />
                  </CollapsibleSection>

                </div>
              </PanelMotion>
            )}

          </AnimatePresence>

          <AnimatePresence>
            {showFinancialModal && (
              <FinancialReport onClose={() => setShowFinancialModal(false)} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── STICKY CONTROL BAR — always accessible ───── */}
      <InventoryActionBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowFinancialModal={setShowFinancialModal}
      />
    </section>
  );
}

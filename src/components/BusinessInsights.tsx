"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

import { fetchBusinessInsights } from "@/src/lib/api/businessInsights";

import Purchase from "../features/stock/Purchase";
import Sale from "../features/stock/Sale";
import StockReport from "../features/stock/StockReport";

import StockAlertSmart from "../features/Insights/StockAlert";
import StockValuation from "../features/stock/StockValuation";
import CashFlowWatch from "../features/Insights/CashFlow";
import SlowMovingStockContainer from "../features/Insights/SlowMovingStockContainer";

import { Layout, Sparkles, Zap } from "lucide-react";

// NEW WRAPPERS
import InsightHero from "./Insights/InsightHero";
import AlertCard from "./Insights/AlertCard";
import AIInsightPanel from "./Insights/AIInsightPanel";
import { AnalyticsSection } from "./Insights/AnalyticsSection";
import FloatingActionBar from "./Insights/FloatingActionBar";

const PanelMotion = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 16 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="relative z-[60]"
  >
    {children}
  </motion.div>
);

function InsightsSkeleton() {
  return (
    <div className="flex flex-col gap-8 w-full animate-pulse mt-12 max-w-[1400px] mx-auto px-6">
      <div className="h-40 w-full bg-white/5 rounded-3xl" />
      <div className="h-80 w-full bg-white/5 rounded-3xl" />
      <div className="h-64 w-full bg-white/5 rounded-3xl" />
    </div>
  );
}

export default function BusinessInsights() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [newPurchase, setNewPurchase] = useState(false);
  const [newSale, setNewSale] = useState(false);
  const [viewStock, setViewStock] = useState(false);
  const [product, setProduct] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [snapshot, setSnapshot] = useState<any>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(true);

  /* ---------------- FETCH SNAPSHOT ---------------- */

  useEffect(() => {
    if (!email) return;

    const load = async () => {
      setLoadingSnapshot(true);
      try {
        const data = await fetchBusinessInsights(email);
        setSnapshot(data);
      } catch (err) {
        console.error("Business insights failed", err);
      } finally {
        setLoadingSnapshot(false);
      }
    };

    load();
  }, [email, reloadKey]);

  /* ---------------- UI ---------------- */

  return (
    <section className="w-full bg-[#050505] min-h-screen relative overflow-hidden flex flex-col items-center">
      <Toaster />

      {/* HERO SECTION */}
      <InsightHero data={snapshot} loading={loadingSnapshot} />

      <div className="relative z-10 w-full px-4 sm:px-6 pb-48">
        {loadingSnapshot ? (
          <InsightsSkeleton />
        ) : snapshot ? (
          <div className="flex flex-col w-full">

            {/* ALERTS */}
            {snapshot.lowStock && snapshot.lowStock.length > 0 && (
              <AlertCard>
                <div className="bg-[#111] rounded-xl p-4 md:p-6 overflow-hidden border border-white/5">
                  <StockAlertSmart data={snapshot.lowStock} />
                </div>
              </AlertCard>
            )}

            {/* AI Context */}
            {snapshot.lowStock && snapshot.lowStock.length > 0 ? (
               <AIInsightPanel text="Your inventory health requires attention. Immediate reorder actions form the bulk of your operational risk this week." />
            ) : (
               <AIInsightPanel text="Your inventory health shows absolute stability. Supply chains are fully optimized for current demand." />
            )}

            {/* STOCK VALUATION */}
            <AnalyticsSection title="Stock Valuation" subtitle="Capital Lockup" icon={<Layout className="w-4 h-4" />} colorClass="blue">
              <div className="bg-[#111] rounded-2xl overflow-hidden shadow-inner border border-white/5">
                <StockValuation />
              </div>
            </AnalyticsSection>

            {/* AI Context */}
            <AIInsightPanel text="Capital liquidity remains strictly preserved. Cash flow streams indicate a highly sustainable operational runway." />

            {/* CASH FLOW */}
            <AnalyticsSection title="Cash Stream Analysis" subtitle="Liquidity" icon={<Sparkles className="w-4 h-4" />} colorClass="emerald">
              <div className="bg-[#111] rounded-2xl p-2 sm:p-6 shadow-inner border border-white/5 overflow-hidden">
                <CashFlowWatch data={snapshot.cashFlow} />
              </div>
            </AnalyticsSection>

            {/* SLOW MOVING */}
            <AnalyticsSection title="Stagnation Analysis" subtitle="Capital Velocity" icon={<Zap className="w-4 h-4" />} colorClass="amber">
              <div className="bg-[#111] rounded-2xl shadow-inner border border-white/5 overflow-hidden p-2 sm:p-6">
                <SlowMovingStockContainer data={snapshot.slowMoving} />
              </div>
            </AnalyticsSection>

          </div>
        ) : null}
      </div>

      {/* ACTION BAR */}
      <FloatingActionBar 
        onPurchase={() => {setNewPurchase(true); setNewSale(false); setViewStock(false);}}
        onSale={() => {setNewSale(true); setNewPurchase(false); setViewStock(false);}}
        onStock={() => {setViewStock(true); setNewPurchase(false); setNewSale(false);}}
      />

      {/* PANELS */}
      <AnimatePresence mode="wait">
        {newPurchase && (
          <PanelMotion key="purchase">
            <Purchase
              visible
              preSelectedProduct={product}
              reloadSetter={() => setReloadKey(k => k + 1)}
              reload={reloadKey}
            />
          </PanelMotion>
        )}

        {newSale && (
          <PanelMotion key="sale">
            <Sale
              visible
              preSelectedProduct={product}
              reloadSetter={() => setReloadKey(k => k + 1)}
              reload={reloadKey}
            />
          </PanelMotion>
        )}

        {viewStock && (
          <PanelMotion key="stock">
            <StockReport
              visible
              data={snapshot?.stockReport}
              productSetter={setProduct}
              purchaseSetter={setNewPurchase}
              saleSetter={setNewSale}
              reloadKey={reloadKey}
            />
          </PanelMotion>
        )}
      </AnimatePresence>

    </section>
  );
}

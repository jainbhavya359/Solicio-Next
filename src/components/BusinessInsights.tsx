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

const PanelMotion = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 16 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

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
    <section className="bg-[#F7FAF9] my-4 min-h-screen py-20">
      <Toaster />

      <div className="max-w-7xl mx-auto px-6 space-y-12">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900">
            Business Insights
          </h1>
          <p className="mt-2 text-stone-600 max-w-2xl">
            Real-time view of risks, stock health, and cash exposure.
          </p>
        </motion.div>

        {/* INSIGHTS GRID */}
        {!loadingSnapshot && snapshot && (
          <div className="grid gap-6 lg:grid-cols-2">

            <InsightCard title="Stock Alerts">
              <StockAlertSmart data={snapshot.lowStock} />
            </InsightCard>

            <InsightCard title="Stock Valuation">
              <StockValuation />
            </InsightCard>

            <InsightCard title="Cash Flow">
              <CashFlowWatch data={snapshot.cashFlow} />
            </InsightCard>

            <InsightCard title="Slow Moving Stock">
              <SlowMovingStockContainer
                data={snapshot.slowMoving}
              />
            </InsightCard>

          </div>
        )}

        {/* ACTION BAR */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-wrap gap-4">
          <ActionButton
            onClick={() => {
              setNewPurchase(true);
              setNewSale(false);
              setViewStock(false);
            }}
          >
            Add Purchase
          </ActionButton>

          <ActionButton
            onClick={() => {
              setNewSale(true);
              setNewPurchase(false);
              setViewStock(false);
            }}
          >
            Record Sale
          </ActionButton>

          <ActionButton
            variant="secondary"
            onClick={() => {
              setViewStock(true);
              setNewPurchase(false);
              setNewSale(false);
            }}
          >
            View Inventory
          </ActionButton>
        </div>

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

      </div>
    </section>
  );
}


/* ---------- helpers ---------- */

function InsightCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="
        bg-white border border-stone-200 rounded-2xl
        p-6 shadow-sm hover:shadow-md transition
      "
    >
      <h3 className="font-semibold text-stone-900 mb-4">
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

function ActionButton({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5 py-2.5 rounded-xl text-sm font-semibold transition
        ${
          variant === "primary"
            ? "bg-emerald-600 text-white hover:bg-emerald-700"
            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
        }
      `}
    >
      {children}
    </button>
  );
}


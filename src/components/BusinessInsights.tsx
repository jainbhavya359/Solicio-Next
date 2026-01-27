"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import Purchase from "@/src/components/Purchase";
import Sale from "./Sale";
import StockReport from "./stockRelated/StockReport";
import StockAlertSmart from "./Insights/StockAlert";
import StockValuation from "./stockRelated/StockValuation";
import CashFlowWatch from "./Insights/CashFlow";
import SlowMovingStockContainer from "./Insights/SlowMovingStockContainer";

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
  const [newPurchase, setNewPurchase] = useState(false);
  const [newSale, setNewSale] = useState(false);
  const [viewStock, setViewStock] = useState(false);
  const [product, setProduct] = useState("");
  const [reload, setReload] = useState(false);

  return (
    <section className="bg-[#F7FAF9] my-4 min-h-screen py-20">
      <Toaster />

      <div className="max-w-7xl mx-auto px-6 space-y-12">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900">
            Business Insights
          </h1>
          <p className="mt-2 text-stone-600 max-w-2xl">
            A real-time view of your stock, cash flow, risks, and opportunities — all in one place.
          </p>
        </motion.div>

        {/* INSIGHTS GRID */}
        <div className="grid gap-6 lg:grid-cols-2">

          <InsightCard title="Stock Alerts">
            <StockAlertSmart />
          </InsightCard>

          <InsightCard title="Stock Valuation">
            <StockValuation />
          </InsightCard>
          
          <InsightCard title="Cash Flow">
            <CashFlowWatch />
          </InsightCard>
          
          <InsightCard title="Slow Moving Stock">
            <SlowMovingStockContainer />
          </InsightCard>
        </div>

        {/* ACTION BAR */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="
            bg-white border border-stone-200 rounded-2xl
            p-6 shadow-sm flex flex-wrap items-center gap-4
          "
        >
          <span className="text-sm font-medium text-stone-600 mr-4">
            Quick actions
          </span>

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
        </motion.div>

        {/* PANELS */}
        <AnimatePresence mode="wait">
          {newPurchase && (
            <PanelMotion key="purchase">
              <Purchase
                visible
                preSelectedProduct={product}
                reloadSetter={setReload}
                reload={reload}
              />
            </PanelMotion>
          )}

          {newSale && (
            <PanelMotion key="sale">
              <Sale
                visible
                preSelectedProduct={product}
                reloadSetter={setReload}
                reload={reload}
              />
            </PanelMotion>
          )}

          {viewStock && (
            <PanelMotion key="stock">
              <StockReport
                visible
                productSetter={setProduct}
                purchaseSetter={setNewPurchase}
                saleSetter={setNewSale}
                reload={reload}
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


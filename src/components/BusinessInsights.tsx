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

import { Megaphone, Activity, Sparkles, Layout, ChevronRight, Zap } from "lucide-react";

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
    <section className="bg-white my-4 min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Background radial grid */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      <Toaster />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 space-y-20">

        {/* HERO HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-6 border border-emerald-100/50">
            <Activity className="w-3 h-3" />
            Neural Analysis Center
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tightest leading-none">
            Business <span className="text-emerald-600">Insights</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 leading-relaxed font-medium">
            Strategic real-time view of operation risks, inventory health, and neural cash exposure forecasting.
          </p>
        </motion.div>

        {/* INSIGHTS GRID */}
        {!loadingSnapshot && snapshot && (
          <div className="grid gap-12 grid-cols-1">

            <InsightCard title="Dynamic Stock Alerts" icon={<Activity className="w-4 h-4" />}>
              <StockAlertSmart data={snapshot.lowStock} />
            </InsightCard>

            <InsightCard title="Inventory Valuation" icon={<Layout className="w-4 h-4" />}>
              <StockValuation />
            </InsightCard>

            <InsightCard title="Cash Stream Analysis" icon={<Sparkles className="w-4 h-4" />}>
              <CashFlowWatch data={snapshot.cashFlow} />
            </InsightCard>

            <InsightCard title="Stagnation Analysis" icon={<Zap className="w-4 h-4" />}>
              <SlowMovingStockContainer
                data={snapshot.slowMoving}
              />
            </InsightCard>

          </div>
        )}

        {/* STRATEGIC ACTION BAR */}
        <div className="sticky bottom-8 z-30 flex justify-center w-full pointer-events-none">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-2.5 shadow-2xl flex items-center gap-2 pointer-events-auto"
          >
            <ActionButton
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                setNewPurchase(true);
                setNewSale(false);
                setViewStock(false);
              }}
            >
              Add Purchase
            </ActionButton>

            <ActionButton
              icon={<Zap className="w-4 h-4" />}
              onClick={() => {
                setNewSale(true);
                setNewPurchase(false);
                setViewStock(false);
              }}
            >
              Record Sale
            </ActionButton>

            <div className="w-px h-8 bg-white/10 mx-1" />

            <ActionButton
              variant="secondary"
              icon={<Layout className="w-4 h-4" />}
              onClick={() => {
                setViewStock(true);
                setNewPurchase(false);
                setNewSale(false);
              }}
            >
              Inventory Map
            </ActionButton>
          </motion.div>
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
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="
        bg-white border border-slate-100 rounded-[2rem]
        p-8 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group relative overflow-hidden
      "
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

      <div className="relative flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 tracking-tight">
              {title}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Insights active</p>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

function ActionButton({
  children,
  onClick,
  icon,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200
        ${variant === "primary"
          ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/40"
          : "bg-white/10 text-white hover:bg-white/20"
        }
      `}
    >
      {icon}
      {children}
    </button>
  );
}


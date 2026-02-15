"use client";

import { useState, useEffect } from "react";
import { fetchInventorySnapshot } from "@/src/lib/api/inventory";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

import Purchase from "../features/stock/Purchase";
import Sale from "../features/stock/Sale";
import StockReport from "../features/stock/StockReport";
import StockAlertSmart from "../features/Insights/StockAlert";
import StockHistory from "../features/stock/StockHistory";
import ProfitLossReport from "../features/stock/ProfitLossReoprt";

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

export default function Inventory() {
  const [newPurchase, setNewPurchase] = useState(false);
  const [newSale, setNewSale] = useState(false);
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


  return (
    <section className="bg-stone-50 py-24">
      <Toaster />

      <div className="max-w-7xl mx-auto px-6 space-y-20">

        {/* HEADER */}
        <header className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900">
            Inventory & Operations
          </h1>
          <p className="mt-4 text-lg text-stone-600">
            Track stock, record purchases and sales, and understand how your
            inventory impacts profit.
          </p>
        </header>

        {/* ACTION BAR */}
        <section className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">
            Quick actions
          </h2>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                setNewPurchase(true);
                setNewSale(false);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition
                ${
                  newPurchase
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
            >
              Add Purchase
            </button>

            <button
              onClick={() => {
                setNewSale(true);
                setNewPurchase(false);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition
                ${
                  newSale
                    ? "bg-rose-600 text-white"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
            >
              Record Sale
            </button>

            <button
              onClick={() => {
                setNewPurchase(false);
                setNewSale(false);
              }}
              className="px-6 py-3 rounded-xl font-semibold
              bg-stone-100 text-stone-700 hover:bg-stone-200 transition"
            >
              View Inventory
            </button>
          </div>
        </section>

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

        {/* INVENTORY TABLE */}
        <PanelMotion>
          <StockReport
            visible={true}
            data={snapshot?.inventory}
            productSetter={setProduct}
            purchaseSetter={setNewPurchase}
            saleSetter={setNewSale}
          />
        </PanelMotion>

        {/* INSIGHTS */}
        <section className="space-y-16">
          <StockAlertSmart data={snapshot?.lowStock} />
          <StockHistory data={snapshot?.stockHistory} />
          <ProfitLossReport />
        </section>

      </div>
    </section>
  );
}

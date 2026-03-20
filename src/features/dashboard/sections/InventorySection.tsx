"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import StockReport from "../../stock/StockReport";
import Purchase from "../../stock/Purchase";
import Sale from "../../stock/Sale";
import TopProductsCard from "../../Insights/TopProductCard";
import StockAlertSmart from "../../Insights/StockAlert";
import StockValuation from "../../stock/StockValuation";
import InventorySkeleton from "../components/skeletons/InventorySkeleton";
import { DashboardData } from "../types/dashboard";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
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

interface Props {
  dashboardData: DashboardData | null;
  loadingDashboard: boolean;
  reload: boolean;
  setReload: (v: boolean) => void;
}

export default function InventorySection({ dashboardData, loadingDashboard, reload, setReload }: Props) {
  const [newPurchase, setNewPurchase] = useState(false);
  const [newSale, setNewSale] = useState(false);
  const [product, setProduct] = useState("");

  if (loadingDashboard) return <InventorySkeleton />;

  return (
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
  );
}

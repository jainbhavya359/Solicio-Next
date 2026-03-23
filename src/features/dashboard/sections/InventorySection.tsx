"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardData } from "../types/dashboard";

import InventorySkeleton from "../components/skeletons/InventorySkeleton";
import Purchase from "../../stock/Purchase";
import Sale from "../../stock/Sale";
import StockReport from "../../stock/StockReport";

import InventoryHeader from "../components/inventory/InventoryHeader";
import InventoryAlertStrip from "../components/inventory/InventoryAlertStrip";
import InventorySummaryCards from "../components/inventory/InventorySummaryCards";
import InventoryTablePreview from "../components/inventory/InventoryTablePreview";
import TopProductsCompact from "../components/inventory/TopProductsCompact";
import InventoryInsightPanel from "../components/inventory/InventoryInsightPanel";
import InventoryActionFooter from "../components/inventory/InventoryActionFooter";

const PanelMotion = ({ children, isFullScreen = false }: { children: React.ReactNode, isFullScreen?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 12, scale: 0.98 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
  >
    <div className={`w-full ${isFullScreen ? 'max-w-7xl h-[90vh]' : 'max-w-4xl max-h-[90vh]'} bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden overflow-y-auto`}>
      {children}
    </div>
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
  const [showFullInventory, setShowFullInventory] = useState(false);
  const [productStub, setProductStub] = useState("");

  if (loadingDashboard) return <InventorySkeleton />;

  return (
    <div className="flex flex-col">
      {/* 1. Module Header */}
      <InventoryHeader 
        onNewPurchase={() => setNewPurchase(true)} 
        onNewSale={() => setNewSale(true)} 
        onOpenFullInventory={() => setShowFullInventory(true)}
      />

      {/* 2. Priority Alert Strip */}
      <InventoryAlertStrip 
        lowStock={dashboardData?.lowStock}
        slowMoving={dashboardData?.slowMoving?.slowMoving}
        slowMovingCount={dashboardData?.slowMoving?.slowMovingCount}
        slowStockValue={dashboardData?.slowMoving?.slowStockValue}
      />

      {/* 3. Summary Cards */}
      <InventorySummaryCards 
        inventoryData={dashboardData?.inventory}
        slowStockData={dashboardData?.slowMoving}
        healthData={dashboardData?.healthSummary}
      />

      {/* 4. AI Insight Panel */}
      <InventoryInsightPanel 
        slowStockValue={dashboardData?.slowMoving?.slowStockValue}
        topSkuRevenuePct={12.4} /* Note: Dynamic extraction feasible from signals */
        healthLabel={dashboardData?.lowStock?.length ? "Requires Attention" : "Optimal"}
      />

      {/* 5. Data View Grid (Table Preview & Top Products) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <InventoryTablePreview data={dashboardData?.inventory} />
        </div>
        <div className="lg:col-span-1">
           <TopProductsCompact />
        </div>
      </div>

      {/* 6. Action Footer */}
      <InventoryActionFooter onOpenFullInventory={() => setShowFullInventory(true)} />

      {/* 7. Action Modals */}
      <AnimatePresence mode="wait">
        
        {/* Full Inventory Ledger Modal */}
        {showFullInventory && (
           <PanelMotion key="ledger" isFullScreen>
             <div className="relative h-full flex flex-col">
               <button onClick={() => setShowFullInventory(false)} className="absolute top-6 right-6 z-50 p-2.5 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 hover:text-rose-400 transition-all shadow-lg backdrop-blur-md">
                 ✕ Close Master Ledger
               </button>
               <div className="p-4 flex-1 overflow-y-auto pt-16 sm:pt-4">
                 <StockReport 
                    visible={true}
                    data={dashboardData?.inventory}
                    productSetter={setProductStub}
                    purchaseSetter={setNewPurchase}
                    saleSetter={setNewSale}
                    reloadSetter={setReload}
                 />
               </div>
             </div>
           </PanelMotion>
        )}

        {/* Existing Record Purchase Modal */}
        {newPurchase && (
          <PanelMotion key="purchase">
            <div className="relative">
              <button onClick={() => setNewPurchase(false)} className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full text-white hover:bg-white/20">✕</button>
              <Purchase
                visible={true}
                preSelectedProduct={productStub}
                reloadSetter={setReload}
                reload={reload}
              />
            </div>
          </PanelMotion>
        )}

        {/* Existing Record Sale Modal */}
        {newSale && (
          <PanelMotion key="sale">
             <div className="relative">
              <button onClick={() => setNewSale(false)} className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full text-white hover:bg-white/20">✕</button>
              <Sale
                visible={true}
                preSelectedProduct={productStub}
                reloadSetter={setReload}
                reload={reload}
              />
            </div>
          </PanelMotion>
        )}

      </AnimatePresence>
    </div>
  );
}

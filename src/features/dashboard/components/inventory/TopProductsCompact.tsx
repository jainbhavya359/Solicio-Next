"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

type ProductSignal = {
  _id: string;
  sales: number;
  qty: number;
};

export default function TopProductsCompact() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const today = new Date().toISOString().split("T")[0];
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  const monthAgo = lastMonth.toISOString().split("T")[0];

  const [products, setProducts] = useState<ProductSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    const fetchTopProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/insights/sales-trend", {
          params: { email, from: monthAgo, to: today },
        });
        setProducts(res.data.productSignals?.slice(0, 4) || []);
      } catch (err) {
        console.error("Failed to fetch top products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [email, monthAgo, today]);

  if (loading || (!loading && products.length === 0)) return (
     <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden flex flex-col items-center justify-center p-8 h-full min-h-[300px]">
        {loading ? (
           <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 animate-pulse">Scanning DB...</p>
        ) : (
           <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">No Sales Data</p>
        )}
     </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden flex flex-col h-full min-h-[300px]"
    >
      <div className="p-5 sm:p-6 pb-2">
         <h3 className="text-lg font-bold text-white tracking-tight">Top Movers</h3>
         <p className="text-xs font-medium text-slate-400 mt-0.5">Best performing SKUs by volume</p>
      </div>

      <div className="flex-1 p-5 sm:p-6 space-y-3">
        {products.map((product, i) => {
           // Mock a visual trend
           const isUp = i % 2 === 0; 
           const trendColor = isUp ? "text-emerald-400" : "text-rose-400";
           const TrendIcon = isUp ? TrendingUp : TrendingDown;

           return (
             <motion.div 
               key={product._id}
               initial={{ opacity: 0, x: 10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.8 + (i * 0.1) }}
               className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
             >
               <div className="flex items-center gap-3 overflow-hidden">
                 <div className={`p-2 rounded-lg bg-white/5 ${trendColor} shrink-0`}>
                   <TrendIcon className="w-4 h-4" />
                 </div>
                 <div className="min-w-0">
                   <p className="text-sm font-bold text-slate-200 truncate">{product._id}</p>
                   <p className="text-[10px] font-semibold text-slate-500 truncate">{product.qty.toLocaleString('en-IN')} units sold</p>
                 </div>
               </div>
               <div className="text-right pl-3 shrink-0">
                 <p className="text-xs font-bold text-white">{(product.sales / 1000).toFixed(1)}k</p>
               </div>
             </motion.div>
           );
        })}
      </div>

      <div className="p-4 border-t border-white/5 bg-white/[0.02]">
        <Link 
          href="/inventory"
          className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors group uppercase tracking-widest w-full py-2"
        >
          View Full Report <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

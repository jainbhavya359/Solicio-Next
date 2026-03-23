"use client";

import { motion } from "framer-motion";
import { TrendingUp, Package, Activity, ArrowUp, ArrowDown } from "lucide-react";

interface MetricsGridProps {
  salesTrend?: any;
  stockMovement?: any;
  activityRecency?: any;
}

function GridCard({ title, score, scoreMax, valueText, subText, icon: Icon, trend, colorClass, delay }: any) {
  const isUp = trend === "up";
  const trendColor = isUp ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-slate-400";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="p-5 sm:p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-white/5 ${colorClass}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold text-white">{score}</span>
          <span className="text-xs font-medium text-slate-500 mb-1">/{scoreMax}</span>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-xl font-semibold text-white mb-1">{valueText}</p>
          <p className="text-xs text-slate-400">{subText}</p>
        </div>
        {trend && (
           <div className={`flex items-center gap-0.5 ${trendColor} bg-white/5 px-2 py-1 rounded-md`}>
             {isUp ? <ArrowUp className="w-3.5 h-3.5" /> : trend === "down" ? <ArrowDown className="w-3.5 h-3.5" /> : null}
           </div>
        )}
      </div>
    </motion.div>
  );
}

export default function MetricsGrid({ salesTrend, stockMovement, activityRecency }: MetricsGridProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      <GridCard
        title="Sales Health"
        score={salesTrend?.salesHealthScore || 0}
        scoreMax={100}
        valueText={`₹${(salesTrend?.thisWeekSales || 0).toLocaleString()}`}
        subText="This Week"
        icon={TrendingUp}
        trend={salesTrend?.growthPercentage > 0 ? "up" : "down"}
        colorClass="text-emerald-400"
        delay={0.4}
      />
      <GridCard
        title="Stock Velocity"
        score={stockMovement?.stockMovementScore || 0}
        scoreMax={30}
        valueText={stockMovement?.slowMovingCount || 0}
        subText="Slow Items"
        icon={Package}
        trend={stockMovement?.stockMovementScore >= 15 ? "up" : "down"}
        colorClass="text-violet-400"
        delay={0.5}
      />
      <GridCard
        title="Activity Flow"
        score={activityRecency?.activityScore || 0}
        scoreMax={20}
        valueText={activityRecency?.activeDays || 0}
        subText="Active Days (Week)"
        icon={Activity}
        trend={activityRecency?.activityScore >= 10 ? "up" : "down"}
        colorClass="text-blue-400"
        delay={0.6}
      />
    </section>
  );
}

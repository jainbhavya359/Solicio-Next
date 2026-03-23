"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Package, TrendingUp } from "lucide-react";

const COLORS = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function SecondaryInsights({ data }: { data?: any }) {
  if (!data) return null;

  // Top Products Data
  const hasProducts = data.productSignals?.length > 0;
  const totalSales = hasProducts ? data.productSignals.reduce((acc: number, curr: any) => acc + curr.sales, 0) : 0;

  // Margin Data
  const marginData = data.timeline?.map((d: any) => ({
    date: d.date.slice(5),
    margin: d.sales > 0 ? (d.profit / d.sales) * 100 : 0,
  })) || [];
  const currentMargin = data.profitability?.grossMargin || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
      
      {/* TOP PRODUCTS */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 flex flex-col"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Top Movers</h3>
            <p className="text-xs text-slate-400 mt-0.5">Sales contribution</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative h-[160px] w-[160px] flex-shrink-0">
            {hasProducts ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.productSignals}
                      dataKey="sales"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={5}
                      stroke="none"
                    >
                      {data.productSignals.map((_: any, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: "12px" }} itemStyle={{ color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
              </>
            ) : (
               <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-full border border-white/10">
                 <p className="text-xs font-medium text-slate-500">No Data</p>
               </div>
            )}
          </div>
          <div className="flex-1 w-full space-y-3">
             {hasProducts ? data.productSignals.slice(0, 4).map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shadow-lg" style={{ backgroundColor: COLORS[i % COLORS.length], boxShadow: `0 0 8px ${COLORS[i % COLORS.length]}` }} />
                    <span className="text-sm font-medium text-slate-300 truncate max-w-[120px] sm:max-w-full">{p._id}</span>
                  </div>
                  <span className="text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded-full">
                    {((p.sales / totalSales) * 100).toFixed(1)}%
                  </span>
                </div>
             )) : null}
          </div>
        </div>
      </motion.section>

      {/* PROFIT MARGIN */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/10 flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-violet-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Profit Margin</h3>
              <p className="text-xs text-slate-400 mt-0.5">Performance over time</p>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
             <span className="text-2xl font-bold text-white">{currentMargin}%</span>
             <span className="text-xs font-medium text-slate-500">avg</span>
          </div>
        </div>

        <div className="flex-1 w-full mt-2 h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={marginData} margin={{ top: 10, right: 0, bottom: 0, left: -25 }}>
              <defs>
                <linearGradient id="colorMarginGraph" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.05} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} dy={5} />
              <YAxis unit="%" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="margin" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorMarginGraph)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

    </div>
  );
}

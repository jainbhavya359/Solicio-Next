import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";

export default function CapitalInsights({ score }: { score: number }) {
  
  const getInsights = () => {
    if (score < 600) {
      return [
        { icon: <AlertTriangle className="text-rose-400 w-4 h-4" />, text: "Decrease capital utilization below 30% to immediately boost your baseline score." },
        { icon: <TrendingUp className="text-emerald-400 w-4 h-4" />, text: "Automate payments to prevent late logs. This contributes to 35% of your neural evaluation." },
      ];
    } else if (score < 700) {
      return [
        { icon: <Lightbulb className="text-amber-400 w-4 h-4" />, text: "You are nearing a Tier 3 classification. Keep hard inquiries to zero for the next 90 days." },
        { icon: <TrendingUp className="text-emerald-400 w-4 h-4" />, text: "Explore collateral-free options like CGTMSE before taking on private equity loans." },
      ];
    } else {
      return [
        { icon: <Lightbulb className="text-cyan-400 w-4 h-4" />, text: "Optimal configuration detected. You have high probability for sub-prime interest rate negotiations." },
        { icon: <TrendingUp className="text-emerald-400 w-4 h-4" />, text: "Leverage your Excellent rating to consolidate existing high-interest debt structures." },
      ];
    }
  };

  const insights = getInsights();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 sm:p-8 mt-12 w-full"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Lightbulb className="w-4 h-4" />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
          Capital Recommendations
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <div key={idx} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-start gap-4">
            <div className="mt-0.5">{insight.icon}</div>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

import FeaturesHero from "@/src/components/features/FeaturesHero";
import FeatureShowcase from "@/src/components/features/FeatureShowcase";
import SocialProofDivider from "@/src/components/features/SocialProofDivider";
import BottomCTA from "@/src/components/features/BottomCTA";

export default function FeaturesPage() {
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-emerald-500/30">
      
      <FeaturesHero />

      {/* 1. Insights */}
      <FeatureShowcase
        title="Predictive Business Insights."
        tag="Intelligence"
        description="Stop reacting and start predicting. Our intelligence engine analyzes every transaction, flagging stagnant inventory and exposing hidden profit bleeds before they impact your bottom line."
        bullets={[
          "Real-time profit & loss tracking",
          "Automated anomaly detection (e.g. sudden drop in sales)",
          "Daily actionable summaries sent to your device",
        ]}
        accent="from-indigo-500 to-violet-500"
        reverse={false}
        href="/businessInsights"
      >
        <div className="w-full flex items-end gap-2 justify-between px-6 pb-6 h-56 pt-20 relative">
          {/* Abstract Chart */}
          <div className="absolute top-6 left-6 flex flex-col gap-1">
             <div className="text-3xl font-bold">₹15.2M</div>
             <div className="text-xs text-emerald-400">+12% vs last month</div>
          </div>
          {[40, 60, 35, 80, 50, 95, 75].map((h, i) => (
             <div key={i} className="w-[12%] rounded-t-sm bg-gradient-to-t from-violet-600 to-indigo-400 relative group animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}k
                </div>
             </div>
          ))}
        </div>
      </FeatureShowcase>

      {/* 2. Inventory */}
      <FeatureShowcase
        title="Zero-Friction Logistics."
        tag="Logistics"
        description="Track purchases, manage complex stock locations, and map profit margins without ever opening a spreadsheet. If stock falls below threshold, the hub notifies you instantly."
        bullets={[
          "Multi-location stock tracking",
          "One-click low-stock reorder generation",
          "Profit-margin heatmaps per item",
        ]}
        accent="from-emerald-500 to-teal-500"
        reverse={true}
        href="/inventory"
      >
         <div className="flex flex-col gap-4 w-full px-8">
            <div className="w-full h-16 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 justify-between backdrop-blur-md">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">A</div>
                  <div className="flex flex-col"><span className="text-sm font-bold">Premium Rice (20kg)</span><span className="text-[10px] text-slate-400">SKU-9920</span></div>
               </div>
               <div className="text-right flex flex-col"><span className="text-sm font-bold text-emerald-400">14 In Stock</span><span className="text-[10px] text-slate-400">Optimal</span></div>
            </div>
            <div className="w-full h-16 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 justify-between backdrop-blur-md">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold">B</div>
                  <div className="flex flex-col"><span className="text-sm font-bold">Refined Oil (5L)</span><span className="text-[10px] text-slate-400">SKU-1044</span></div>
               </div>
               <div className="text-right flex flex-col"><span className="text-sm font-bold text-rose-400">2 In Stock</span><span className="text-[10px] text-slate-400">Reorder Now</span></div>
            </div>
            <div className="w-full h-16 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 justify-between backdrop-blur-md">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">C</div>
                  <div className="flex flex-col"><span className="text-sm font-bold">Organic Wheat</span><span className="text-[10px] text-slate-400">SKU-3321</span></div>
               </div>
               <div className="text-right flex flex-col"><span className="text-sm font-bold text-emerald-400">55 In Stock</span><span className="text-[10px] text-slate-400">Optimal</span></div>
            </div>
         </div>
      </FeatureShowcase>

      <SocialProofDivider />

      {/* 3. Loans */}
      <FeatureShowcase
        title="Frictionless Capital Access."
        tag="Funding"
        description="We synthesize your operations metadata into a living credit profile. Understand exactly what impacts your score, and unlock affordable MSME funding options directly through the hub."
        bullets={[
          "Live business credit score monitoring",
          "Automated loan eligibility calculator",
          "Direct integration with top financial partners",
        ]}
        accent="from-amber-500 to-orange-500"
        reverse={false}
        href="/loan"
      >
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Abstract Gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="40" className="stroke-white/10" strokeWidth="8" fill="none" />
               <circle cx="50" cy="50" r="40" className="stroke-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="60" style={{ transition: "stroke-dashoffset 2s ease-out" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
               <span className="text-3xl font-black text-white">780</span>
               <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold mt-1">Excellent</span>
            </div>
        </div>
      </FeatureShowcase>

      {/* 4. Education */}
      <FeatureShowcase
        title="Decoded Business Logic."
        tag="Education"
        description="Complex financial jargon and operational protocols translate automatically into simple, actionable language. Make expert-level decisions, without needing an MBA."
        bullets={[
          "Context-aware explanations for financial terms",
          "Step-by-step guides for standard operating procedures",
          "Market benchmark comparisons for your sector",
        ]}
        accent="from-blue-500 to-cyan-500"
        reverse={true}
        href="/business"
      >
         <div className="w-3/4 bg-white/5 border border-white/10 rounded-2xl p-6 relative">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)] animate-bounce">
               <span className="text-xl">✨</span>
            </div>
            <div className="w-1/3 h-2 bg-white/20 rounded-full mb-4" />
            <div className="w-full h-2 bg-white/10 rounded-full mb-2" />
            <div className="w-5/6 h-2 bg-white/10 rounded-full mb-2" />
            <div className="w-4/6 h-2 bg-white/10 rounded-full mb-6" />
            
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
               <span className="text-xs text-cyan-300 font-medium">
                 <strong className="text-cyan-400">AI Translation:</strong> Your "EBITDA" is simply how much cash your business generated before paying taxes and interest. You are up 15%.
               </span>
            </div>
         </div>
      </FeatureShowcase>

      {/* 5. Network */}
      <FeatureShowcase
        title="Verified Local Networks."
        tag="B2B Sync"
        description="Plug into a vetted ecosystem of wholesalers, suppliers, and distributors. We map the most efficient supply chains in your exact pin code so you never run out of critical stock."
        bullets={[
          "Geographic mapping of verified suppliers",
          "Trust scores based on platform transaction history",
          "Direct procurement requests via the platform",
        ]}
        accent="from-pink-500 to-rose-500"
        reverse={false}
      >
         <div className="w-full h-full relative flex items-center justify-center">
            {/* Abstract network nodes */}
            <div className="w-full max-w-[280px] aspect-square relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-rose-500 rounded-full shadow-[0_0_40px_rgba(244,63,94,0.6)] z-20 flex items-center justify-center text-xs font-bold text-white">YOU</div>
               
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2 bg-gradient-to-b from-white/20 to-rose-500/50" />
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-[10px] z-20 backdrop-blur-md">SUP</div>
               
               <div className="absolute bottom-4 right-4 w-32 h-1 bg-gradient-to-l from-white/20 to-rose-500/50 origin-left -rotate-45" />
               <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-[10px] z-20 backdrop-blur-md">MFG</div>
               
               <div className="absolute bottom-8 left-0 w-32 h-1 bg-gradient-to-r from-white/20 to-rose-500/50 origin-right rotate-12" />
               <div className="absolute bottom-8 left-0 w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-[10px] z-20 backdrop-blur-md">WHS</div>
            </div>
         </div>
      </FeatureShowcase>

      {/* 6. Compliance */}
      <FeatureShowcase
        title="Zero-Defect Compliance."
        tag="Compliance"
        description="Never miss a tax deadline or let a fire-safety license expire. We digitize, track, and remind you of every bureaucratic requirement mandated for your business tier."
        bullets={[
          "Automated renewal countdowns",
          "Secure cloud vault for business registries",
          "One-click audit report generation",
        ]}
        accent="from-yellow-400 to-amber-500"
        reverse={true}
        href="/licenses"
      >
         <div className="flex flex-col gap-3 w-3/4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
               <div className="flex flex-col gap-1">
                 <span className="text-sm font-bold text-white">GST Filing</span>
                 <span className="text-[10px] text-slate-400">Due in 4 days</span>
               </div>
               <div className="px-2 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded uppercase">Action Reqd</div>
            </div>
            <div className="bg-white/5 border border-emerald-500/30 border-dashed rounded-xl p-4 flex items-center justify-between opacity-70">
               <div className="flex flex-col gap-1">
                 <span className="text-sm font-bold text-white">Trade License</span>
                 <span className="text-[10px] text-slate-400">Valid till 2027</span>
               </div>
               <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[10px]">✓</div>
            </div>
            <div className="bg-white/5 border border-emerald-500/30 border-dashed rounded-xl p-4 flex items-center justify-between opacity-70">
               <div className="flex flex-col gap-1">
                 <span className="text-sm font-bold text-white">FSSAI Registration</span>
                 <span className="text-[10px] text-slate-400">Valid till 2026</span>
               </div>
               <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-[10px]">✓</div>
            </div>
         </div>
      </FeatureShowcase>

      {/* 7. Growth */}
      <FeatureShowcase
        title="Hyper-Visibility Systems."
        tag="Growth"
        description="Transform foot traffic into digital velocity. Simple, highly effective tools to command your local SEO presence, communicate with loyal customers, and run targeted promotions."
        bullets={[
          "Unified Google Business Profile management",
          "Automated SMS/WhatsApp promotion broadcasts",
          "Customer retention metrics & loyalty tracking",
        ]}
        accent="from-fuchsia-500 to-purple-500"
        reverse={false}
        href="/marketing"
      >
         <div className="w-3/4 aspect-[4/3] relative flex items-end justify-between px-4 pb-4 border-b border-l border-white/20">
            {/* Graph Bars */}
            <div className="w-8 bg-fuchsia-500/20 rounded-t h-[20%]" />
            <div className="w-8 bg-fuchsia-500/40 rounded-t h-[40%]" />
            <div className="w-8 bg-purple-500/60 rounded-t h-[55%] relative">
               {/* Tooltip */}
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                 +42% SEO Traffic
               </div>
            </div>
            <div className="w-8 bg-gradient-to-t from-fuchsia-500 to-purple-400 shadow-[0_0_20px_rgba(192,38,211,0.5)] rounded-t h-[85%]" />
            
            {/* Target Line */}
            <div className="absolute top-[30%] left-0 w-full border-t border-purple-400/50 border-dashed" />
         </div>
      </FeatureShowcase>

      <BottomCTA />

    </div>
  );
}
"use client";

import { ComparisonSection } from "./ComparisonSection";
import { CTASection } from "./CTASection";
import { FeaturesSection } from "./FeaturesSection";
import HeroSection from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { InsightsSection } from "./InsightsSection";
import { PricingSection } from "./PricingSection";
import { ProblemsSection } from "./ProblemSection";
import { useThemeStore } from "@/src/store/themeStore";

export default function HomePage() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <div className="relative">
      <div className="dark:bg-slate-950 transition-colors duration-300">
        <HeroSection />
        <ProblemsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <InsightsSection />
        <ComparisonSection />
        <PricingSection />
        <CTASection />
      </div>

      {/* Floating Theme Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg border backdrop-blur-md transition-all
                   bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100
                   dark:bg-slate-800/80 dark:border-slate-700 dark:text-emerald-400 dark:hover:bg-slate-700"
        aria-label="Toggle Dark Mode"
      >
        {isDarkMode ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>
    </div>
  );
}

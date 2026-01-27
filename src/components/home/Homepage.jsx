"use client";

import { useEffect, useState } from "react";
import { ComparisonSection } from "./ComparisonSection";
import { CTASection } from "./CTASection";
import { FeaturesSection } from "./FeaturesSection";
import HeroSection from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { InsightsSection } from "./InsightsSection";
import { PricingSection } from "./PricingSection";
import { ProblemsSection } from "./ProblemSection";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { ActionSuggestionCard, ForecastSummaryCard, KpiCard, MarginTrendGraph, SalesHealthCards, SalesTrendGraphCard, TopProductDonut } from "../Insights/SalesTrendInsightsCard";
import BusinessHealthCard from "../health/BusinessHealthCard";
import StockReport from "../stockRelated/StockReport";
import StockAlertSmart from "../Insights/StockAlert";
import StockHistory from "../stockRelated/StockHistory";
import CashFlowWatch from "../Insights/CashFlow";
import AlertsFeed from "../alerts/AlertsFeed";
import SlowMovingStockContainer from "../Insights/SlowMovingStockContainer";
import StockValuation from "../stockRelated/StockValuation";
import ProfitLossReport from "../stockRelated/ProfitLossReoprt";
import LedgerEntries from "../LedgerEntries";
import LedgerSearchBox from "../LedgerSearchBox";


export default function HomePage() {

  const [ data, setData ] = useState(null);
  const [ reload ,setReload ] = useState(false);
  const { user } = useUser();
  const email = user?.primaryEmailAddress.emailAddress;

  useEffect(()=>{
    if(!email) return;

    const FetchData = async ()=>{
      try{  
        const res = await axios.get("/api/insights/sales-trend", {
          params: {
            email,
            days: 7,
          },
        }); 

        if(res.status === 200){
          setData(res.data);
        }
      }catch(error){
        console.log(error);
      }
    }

    FetchData();
  },[email]);

  return (
    <>
      <HeroSection />
      <ProblemsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <InsightsSection />
      <ComparisonSection />
      <PricingSection />
      <CTASection />
    </>
  );
}

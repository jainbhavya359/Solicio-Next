"use client";

import { useState, useEffect } from "react";
import { fetchDashboardData } from "@/src/lib/api/dashboard";
import { DashboardData } from "../types/dashboard";
import { Loan } from "../../loan_licenses/ActiveLoans";

interface UseDashboardDataReturn {
  dashboardData: DashboardData | null;
  loans: Loan[];
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
  loadingDashboard: boolean;
  loadingLoans: boolean;
  salesTrendData: any | null;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  fromDate: string;
  setFromDate: React.Dispatch<React.SetStateAction<string>>;
  toDate: string;
  setToDate: React.Dispatch<React.SetStateAction<string>>;
}

export function useDashboardData(email: string | undefined): UseDashboardDataReturn {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(true);
  const [reload, setReload] = useState(false);

  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [salesTrendData, setSalesTrendData] = useState<any | null>(null);

  useEffect(() => {
    if (!email) return;

    const load = async () => {
      setLoadingDashboard(true);
      try {
        const data = await fetchDashboardData(email, fromDate, toDate);
        setDashboardData(data as DashboardData);
        setLoans(data.loans);
        setSalesTrendData(data.salesTrend7);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setLoadingDashboard(false);
        setLoadingLoans(false);
      }
    };

    load();
  }, [email, reload, fromDate, toDate]);

  return {
    dashboardData,
    loans,
    setLoans,
    loadingDashboard,
    loadingLoans,
    salesTrendData,
    reload,
    setReload,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  };
}

// Shared TypeScript interfaces / types for the Dashboard feature.
// Import from here so all components agree on the same shape.

export interface KpiEntry {
  value: number;
  pct: number;
}

export interface DashboardKpis {
  revenue: KpiEntry;
  profit: KpiEntry;
  inventory: KpiEntry;
  orders: KpiEntry;
}

export interface DashboardData {
  loans: any[];
  salesTrend7: any;
  salesTrend14: any;
  kpis: DashboardKpis;
  cashFlow: any;
  healthSummary: any;
  lowStock: any;
  slowMoving: {
    slowMoving: any[];
    slowMovingCount: number;
    slowStockValue: number;
  } | null;
  inventory: any;
  stockHistory: any;
}

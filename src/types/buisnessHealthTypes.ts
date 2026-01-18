export interface StockMovementData {
  stockMovementScore: number;
  productCount: number;
  breakdown: {
    product: string;
    unit: string;
    daysSinceLastSale: number | null;
    score: number;
  }[];
}

export interface SalesTrendData {
  salesTrendScore: number;
  thisWeekSales: number;
  lastWeekSales: number;
  growthPercentage: number;
}

export interface InventoryBalanceData {
  inventoryBalanceScore: number;
  totalStockValue: number;
  totalSalesValue: number;
  stockToSalesRatio: number;
}

export interface ActivityRecencyData {
  activityRecencyScore: number;
  daysInactive: number | null;
  lastActivityDate: string | null;
}

export interface BusinessHealthData {
  healthScore: number;
  status: string;
  breakdown: {
    stockMovementScore: number;
    salesTrendScore: number;
    inventoryBalanceScore: number;
    activityRecencyScore: number;
  };
  stockMovement: StockMovementData;
  salesTrend: SalesTrendData;
  inventoryBalance: InventoryBalanceData;
  activityRecency: ActivityRecencyData;
  alerts?: {
    type: "warning" | "danger";
    message: string;
    suggestion: string;
  }[];

}

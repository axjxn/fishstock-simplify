
import { EntryTime, generateBatchNumber, getTodayFormatted } from "../utils/stockUtils";

// Get dates for demo data
const today = getTodayFormatted();
const yesterday = (() => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toLocaleDateString('en-GB').split('/').join('-');
})();

const twoDaysAgo = (() => {
  const date = new Date();
  date.setDate(date.getDate() - 2);
  return date.toLocaleDateString('en-GB').split('/').join('-');
})();

const threeDaysAgo = (() => {
  const date = new Date();
  date.setDate(date.getDate() - 3);
  return date.toLocaleDateString('en-GB').split('/').join('-');
})();

// Fish types
export const fishTypes = [
  "Seer Fish (Neymeen)",
  "Pomfret (Avoli)",
  "Tuna (Choora)",
  "Sardine (Mathi)",
  "Mackerel (Ayala)",
  "Pearl Spot (Karimeen)",
  "Red Snapper (Chempalli)",
  "Threadfin Bream (Kilimeen)",
  "Barracuda (Sheela)",
  "Shark (Sravu)",
  "Squid (Koonthal)",
  "Prawns (Chemmeen)",
  "Crab (Njandu)"
];

// Stock purchase entries
export interface StockPurchase {
  id: number;
  date: string;
  time: EntryTime;
  itemName: string;
  batchNo: string;
  weight: number;
  ratePerKg: number;
  totalCost: number;
}

export const stockPurchases: StockPurchase[] = [
  // Today's entries
  {
    id: 1,
    date: today,
    time: EntryTime.MORNING,
    itemName: "Seer Fish (Neymeen)",
    batchNo: "B10278945",
    weight: 5,
    ratePerKg: 800,
    totalCost: 4000
  },
  {
    id: 2,
    date: today,
    time: EntryTime.MORNING,
    itemName: "Pomfret (Avoli)",
    batchNo: "B10378946",
    weight: 3,
    ratePerKg: 600,
    totalCost: 1800
  },
  {
    id: 3,
    date: today,
    time: EntryTime.NOON,
    itemName: "Sardine (Mathi)",
    batchNo: "B10478947",
    weight: 8,
    ratePerKg: 200,
    totalCost: 1600
  },
  
  // Yesterday's entries
  {
    id: 4,
    date: yesterday,
    time: EntryTime.MORNING,
    itemName: "Tuna (Choora)",
    batchNo: "B10578948",
    weight: 10,
    ratePerKg: 400,
    totalCost: 4000
  },
  {
    id: 5,
    date: yesterday,
    time: EntryTime.MORNING,
    itemName: "Mackerel (Ayala)",
    batchNo: "B10678949",
    weight: 6,
    ratePerKg: 250,
    totalCost: 1500
  },
  
  // Two days ago entries
  {
    id: 6,
    date: twoDaysAgo,
    time: EntryTime.MORNING,
    itemName: "Pearl Spot (Karimeen)",
    batchNo: "B10778950",
    weight: 4,
    ratePerKg: 700,
    totalCost: 2800
  },
  
  // Three days ago entries
  {
    id: 7,
    date: threeDaysAgo,
    time: EntryTime.MORNING,
    itemName: "Shark (Sravu)",
    batchNo: "B10878951",
    weight: 2,
    ratePerKg: 350,
    totalCost: 700
  }
];

// Stock left entries (night entries)
export interface StockLeft {
  id: number;
  date: string;
  itemName: string;
  batchNo: string;
  stockLeft: number;
}

export const stockLeftEntries: StockLeft[] = [
  // Yesterday's night entries
  {
    id: 1,
    date: yesterday,
    itemName: "Tuna (Choora)",
    batchNo: "B10578948",
    stockLeft: 3
  },
  {
    id: 2,
    date: yesterday,
    itemName: "Mackerel (Ayala)",
    batchNo: "B10678949",
    stockLeft: 1
  },
  
  // Two days ago night entries
  {
    id: 3,
    date: twoDaysAgo,
    itemName: "Pearl Spot (Karimeen)",
    batchNo: "B10778950",
    stockLeft: 1
  },
  
  // Three days ago night entries
  {
    id: 4,
    date: threeDaysAgo,
    itemName: "Shark (Sravu)",
    batchNo: "B10878951",
    stockLeft: 0.5
  }
];

// Stock movement report (auto-generated)
export interface StockMovement {
  date: string;
  itemName: string;
  stockPurchased: number;
  stockLeft: number;
  estimatedSales: number;
  totalPurchaseCost: number;
}

export const stockMovementReports: StockMovement[] = [
  // Yesterday's report
  {
    date: yesterday,
    itemName: "Tuna (Choora)",
    stockPurchased: 10,
    stockLeft: 3,
    estimatedSales: 7,
    totalPurchaseCost: 4000
  },
  {
    date: yesterday,
    itemName: "Mackerel (Ayala)",
    stockPurchased: 6,
    stockLeft: 1,
    estimatedSales: 5,
    totalPurchaseCost: 1500
  },
  
  // Two days ago report
  {
    date: twoDaysAgo,
    itemName: "Pearl Spot (Karimeen)",
    stockPurchased: 4,
    stockLeft: 1,
    estimatedSales: 3,
    totalPurchaseCost: 2800
  },
  
  // Three days ago report
  {
    date: threeDaysAgo,
    itemName: "Shark (Sravu)",
    stockPurchased: 2,
    stockLeft: 0.5,
    estimatedSales: 1.5,
    totalPurchaseCost: 700
  }
];

// Stock alerts
export interface StockAlert {
  id: number;
  type: 'aging' | 'lowStock' | 'overStock' | 'reorder';
  itemName: string;
  batchNo: string;
  message: string;
  date: string;
  severity: 'info' | 'warning' | 'urgent';
}

export const stockAlerts: StockAlert[] = [
  {
    id: 1,
    type: 'aging',
    itemName: "Shark (Sravu)",
    batchNo: "B10878951",
    message: "Stock is 3 days old. Consider urgent sale.",
    date: today,
    severity: 'urgent'
  },
  {
    id: 2,
    type: 'aging',
    itemName: "Pearl Spot (Karimeen)",
    batchNo: "B10778950",
    message: "Stock is 2 days old. Monitor closely.",
    date: today,
    severity: 'warning'
  },
  {
    id: 3,
    type: 'lowStock',
    itemName: "Pomfret (Avoli)",
    batchNo: "",
    message: "Low inventory. Consider restocking.",
    date: yesterday,
    severity: 'info'
  },
  {
    id: 4,
    type: 'reorder',
    itemName: "Sardine (Mathi)",
    batchNo: "",
    message: "Fast-moving item. Increase next order.",
    date: yesterday,
    severity: 'info'
  }
];

// Summary statistics for dashboard
export interface DashboardStats {
  totalStock: number;
  totalValue: number;
  totalPurchasesToday: number;
  estimatedSalesToday: number;
  oldStockCount: number;
  fastMovingItems: string[];
}

export const dashboardStats: DashboardStats = {
  totalStock: 16.5,
  totalValue: 9900,
  totalPurchasesToday: 16,
  estimatedSalesToday: 0, // Will be calculated based on night entry
  oldStockCount: 1,
  fastMovingItems: ["Sardine (Mathi)", "Pomfret (Avoli)"]
};

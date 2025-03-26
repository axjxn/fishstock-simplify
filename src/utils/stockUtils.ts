// Stock status determination based on age
export enum StockStatus {
  FRESH = "fresh",
  MODERATE = "moderate",
  URGENT = "urgent"
}

// Time of day for stock entries
export enum EntryTime {
  MORNING = "Morning",
  NOON = "Noon",
  NIGHT = "Night"
}

// Calculate stock status based on age in days
export const getStockStatus = (ageInDays: number): StockStatus => {
  if (ageInDays <= 1) return StockStatus.FRESH;
  if (ageInDays === 2) return StockStatus.MODERATE;
  return StockStatus.URGENT;
};

// Format currency (Indian Rupees)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format weight with kg
export const formatWeight = (weight: number): string => {
  return `${weight} Kg`;
};

// Calculate total cost
export const calculateTotalCost = (weight: number, ratePerKg: number): number => {
  return weight * ratePerKg;
};

// Generate a unique batch number
export const generateBatchNumber = (): string => {
  const prefix = 'B';
  const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit number
  const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
  return `${prefix}${randomNum}${timestamp}`;
};

// Calculate estimated sales
export const calculateEstimatedSales = (purchased: number, remaining: number): number => {
  return Math.max(0, purchased - remaining);
};

// Format date to display format (DD-MM-YYYY)
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
};

// Parse formatted date string back to Date object
export const parseFormattedDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Get today's date in the formatted string format
export const getTodayFormatted = () => {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
};

// Calculate age in days from a given date
export const calculateAgeInDays = (dateString: string): number => {
  const itemDate = parseFormattedDate(dateString);
  const today = new Date();
  
  // Set both dates to midnight for accurate day calculation
  itemDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - itemDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

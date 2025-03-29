
import { supabase } from "@/integrations/supabase/client";
import { EntryTime } from "@/utils/stockUtils";
import { StockItem } from "@/components/StockTable";

export interface StockPurchaseItem {
  id?: string;
  date: string;
  time: EntryTime;
  itemName: string;
  batchNo: string;
  weight: number;
  ratePerKg: number;
  totalCost: number;
}

export interface StockLeftItem {
  id?: string;
  date: string;
  itemName: string;
  purchasedAmount: number;
  remainingAmount: number;
  estimatedSales: number;
}

// Function to fetch all stock purchases
export const fetchStockPurchases = async (): Promise<StockItem[]> => {
  const { data, error } = await supabase
    .from('stock_purchases')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching stock purchases:', error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    return [];
  }
  
  // Convert DB format to app format
  return data.map(item => ({
    id: item.id,
    date: item.date,
    time: item.time,
    itemName: item.item_name,
    batchNo: item.batch_no,
    weight: Number(item.weight),
    ratePerKg: Number(item.rate_per_kg),
    totalCost: Number(item.total_cost)
  }));
};

// Function to fetch stock purchases for a specific date and time
export const fetchStockPurchasesByDateAndTime = async (date: string, time: EntryTime): Promise<StockItem[]> => {
  const { data, error } = await supabase
    .from('stock_purchases')
    .select('*')
    .eq('date', date)
    .eq('time', time)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching stock purchases:', error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    return [];
  }
  
  // Convert DB format to app format
  return data.map(item => ({
    id: item.id,
    date: item.date,
    time: item.time,
    itemName: item.item_name,
    batchNo: item.batch_no,
    weight: Number(item.weight),
    ratePerKg: Number(item.rate_per_kg),
    totalCost: Number(item.total_cost)
  }));
};

// Function to add a new stock purchase
export const addStockPurchase = async (stockItem: StockPurchaseItem) => {
  const { data, error } = await supabase
    .from('stock_purchases')
    .insert([
      {
        date: stockItem.date,
        time: stockItem.time,
        item_name: stockItem.itemName,
        batch_no: stockItem.batchNo,
        weight: stockItem.weight,
        rate_per_kg: stockItem.ratePerKg,
        total_cost: stockItem.totalCost
      }
    ])
    .select();
  
  if (error) {
    console.error('Error adding stock purchase:', error);
    throw error;
  }
  
  return data;
};

// Function to fetch stock left entries
export const fetchStockLeftEntries = async () => {
  const { data, error } = await supabase
    .from('stock_left')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching stock left entries:', error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    return [];
  }
  
  // Convert DB format to app format
  return data.map(item => ({
    id: item.id,
    date: item.date,
    itemName: item.item_name,
    purchasedAmount: Number(item.purchased_amount),
    remainingAmount: Number(item.remaining_amount),
    estimatedSales: Number(item.estimated_sales)
  }));
};

// Function to add a new stock left entry
export const addStockLeftEntry = async (stockLeftItem: StockLeftItem) => {
  const { data, error } = await supabase
    .from('stock_left')
    .insert([
      {
        date: stockLeftItem.date,
        item_name: stockLeftItem.itemName,
        purchased_amount: stockLeftItem.purchasedAmount,
        remaining_amount: stockLeftItem.remainingAmount,
        estimated_sales: stockLeftItem.estimatedSales
      }
    ])
    .select();
  
  if (error) {
    console.error('Error adding stock left entry:', error);
    throw error;
  }
  
  return data;
};

// Function to delete all stock purchases
export const deleteAllStockPurchases = async () => {
  const { error } = await supabase
    .from('stock_purchases')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // This ensures we delete all records

  if (error) {
    console.error('Error deleting stock purchases:', error);
    throw error;
  }
};

// Function to delete all stock left entries
export const deleteAllStockLeftEntries = async () => {
  const { error } = await supabase
    .from('stock_left')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // This ensures we delete all records

  if (error) {
    console.error('Error deleting stock left entries:', error);
    throw error;
  }
};

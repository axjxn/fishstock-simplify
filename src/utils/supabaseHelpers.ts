
import { supabase } from "@/integrations/supabase/client";
import { EntryTime } from "@/utils/stockUtils";
import { StockItem } from "@/components/StockTable";
import { toast } from "sonner";

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
  try {
    console.log("Fetching stock purchases...");
    const { data, error } = await supabase
      .from('stock_purchases')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching stock purchases:', error);
      
      // Show different error message based on error code
      if (error.code === 'PGRST301') {
        toast.error("Permission denied. You might not have proper access rights.");
      } else {
        toast.error("Failed to load stock data: " + error.message);
      }
      
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No stock purchase data found");
      return [];
    }
    
    console.log(`Fetched ${data.length} stock purchases`);
    
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
  } catch (err) {
    console.error("Error in fetchStockPurchases:", err);
    toast.error("Failed to load stock data. Please try again later.");
    return [];
  }
};

// Function to fetch stock purchases for a specific date and time
export const fetchStockPurchasesByDateAndTime = async (date: string, time: EntryTime): Promise<StockItem[]> => {
  try {
    console.log(`Fetching stock purchases for date: ${date}, time: ${time}`);
    const { data, error } = await supabase
      .from('stock_purchases')
      .select('*')
      .eq('date', date)
      .eq('time', time)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching stock purchases by date and time:', error);
      
      // Show different error message based on error code
      if (error.code === 'PGRST301') {
        toast.error("Permission denied. You might not have proper access rights.");
      } else {
        toast.error("Failed to load filtered stock data: " + error.message);
      }
      
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log(`No stock purchases found for date: ${date}, time: ${time}`);
      return [];
    }
    
    console.log(`Fetched ${data.length} stock purchases for date: ${date}, time: ${time}`);
    
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
  } catch (err) {
    console.error("Error in fetchStockPurchasesByDateAndTime:", err);
    toast.error("Failed to load filtered stock data. Please try again later.");
    return [];
  }
};

// Function to add a new stock purchase
export const addStockPurchase = async (stockItem: StockPurchaseItem) => {
  try {
    console.log("Adding stock purchase:", stockItem);
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
      
      // Show different error message based on error code
      if (error.code === 'PGRST301') {
        toast.error("Permission denied. You don't have rights to add stock purchases.");
      } else if (error.code === '23505') {
        toast.error("This stock purchase already exists.");
      } else {
        toast.error("Failed to add stock purchase: " + error.message);
      }
      
      throw error;
    }
    
    console.log("Stock purchase added successfully");
    toast.success("Stock purchase added successfully");
    return data;
  } catch (err) {
    console.error("Error in addStockPurchase:", err);
    toast.error("Failed to add stock purchase. Please try again later.");
    throw err;
  }
};

// Function to fetch stock left entries
export const fetchStockLeftEntries = async () => {
  try {
    console.log("Fetching stock left entries...");
    const { data, error } = await supabase
      .from('stock_left')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching stock left entries:', error);
      
      // Show different error message based on error code
      if (error.code === 'PGRST301') {
        toast.error("Permission denied. You might not have proper access rights.");
      } else {
        toast.error("Failed to load stock left data: " + error.message);
      }
      
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log("No stock left entries found");
      return [];
    }
    
    console.log(`Fetched ${data.length} stock left entries`);
    
    // Convert DB format to app format
    return data.map(item => ({
      id: item.id,
      date: item.date,
      itemName: item.item_name,
      purchasedAmount: Number(item.purchased_amount),
      remainingAmount: Number(item.remaining_amount),
      estimatedSales: Number(item.estimated_sales)
    }));
  } catch (err) {
    console.error("Error in fetchStockLeftEntries:", err);
    toast.error("Failed to load stock left data. Please try again later.");
    return [];
  }
};

// Function to add a new stock left entry
export const addStockLeftEntry = async (stockLeftItem: StockLeftItem) => {
  try {
    console.log("Adding stock left entry:", stockLeftItem);
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
      
      // Show different error message based on error code
      if (error.code === 'PGRST301') {
        toast.error("Permission denied. You don't have rights to add stock left entries.");
      } else if (error.code === '23505') {
        toast.error("This stock left entry already exists.");
      } else {
        toast.error("Failed to add stock left entry: " + error.message);
      }
      
      throw error;
    }
    
    console.log("Stock left entry added successfully");
    toast.success("Stock left entry added successfully");
    return data;
  } catch (err) {
    console.error("Error in addStockLeftEntry:", err);
    toast.error("Failed to add stock left entry. Please try again later.");
    throw err;
  }
};

// Function to delete all stock purchases
export const deleteAllStockPurchases = async () => {
  try {
    console.log("Deleting all stock purchases...");
    const { error } = await supabase
      .from('stock_purchases')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // This ensures we delete all records

    if (error) {
      console.error('Error deleting stock purchases:', error);
      
      // Show different error message based on error code
      if (error.code === 'PGRST301') {
        toast.error("Permission denied. You don't have rights to delete stock purchases.");
      } else {
        toast.error("Failed to delete stock purchases: " + error.message);
      }
      
      throw error;
    }

    console.log("All stock purchases deleted successfully");
    toast.success("All stock purchases deleted successfully");
  } catch (err) {
    console.error("Error in deleteAllStockPurchases:", err);
    toast.error("Failed to delete stock purchases. Please try again later.");
    throw err;
  }
};

// Function to delete all stock left entries
export const deleteAllStockLeftEntries = async () => {
  try {
    console.log("Deleting all stock left entries...");
    const { error } = await supabase
      .from('stock_left')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // This ensures we delete all records

    if (error) {
      console.error('Error deleting stock left entries:', error);
      
      // Show different error message based on error code
      if (error.code === 'PGRST301') {
        toast.error("Permission denied. You don't have rights to delete stock left entries.");
      } else {
        toast.error("Failed to delete stock left entries: " + error.message);
      }
      
      throw error;
    }

    console.log("All stock left entries deleted successfully");
    toast.success("All stock left entries deleted successfully");
  } catch (err) {
    console.error("Error in deleteAllStockLeftEntries:", err);
    toast.error("Failed to delete stock left entries. Please try again later.");
    throw err;
  }
};


import { useToast } from "@/hooks/use-toast";
import { fishTypes } from "@/data/mockData";
import { calculateEstimatedSales, formatWeight, getTodayFormatted } from "@/utils/stockUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Save, RotateCcw, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import BatchIndicator from "@/components/BatchIndicator";
import { fetchStockPurchasesByDateAndTime, addStockLeftEntry } from "@/utils/supabaseHelpers";
import { EntryTime } from "@/utils/stockUtils";

interface PurchasesByItemData {
  totalWeight: number;
  batchNumbers: string[];
}

const StockLeft = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [stockLeft, setStockLeft] = useState<Record<string, number>>({});
  const [todayPurchases, setTodayPurchases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch today's purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      setIsLoading(true);
      try {
        const today = getTodayFormatted();
        
        // Fetch both morning and noon entries
        const morningEntries = await fetchStockPurchasesByDateAndTime(today, EntryTime.MORNING);
        const noonEntries = await fetchStockPurchasesByDateAndTime(today, EntryTime.NOON);
        
        // Combine entries
        setTodayPurchases([...morningEntries, ...noonEntries]);
      } catch (error) {
        console.error('Error fetching today\'s purchases:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPurchases();
  }, []);
  
  // Group purchases by item
  const purchasesByItem: Record<string, PurchasesByItemData> = todayPurchases.reduce((acc, item) => {
    if (!acc[item.itemName]) {
      acc[item.itemName] = {
        totalWeight: 0,
        batchNumbers: [] as string[]
      };
    }
    
    acc[item.itemName].totalWeight += item.weight;
    acc[item.itemName].batchNumbers.push(item.batchNo);
    
    return acc;
  }, {} as Record<string, PurchasesByItemData>);
  
  // Prepare data for table
  const tableData = Object.entries(purchasesByItem).map(([itemName, data]) => ({
    itemName,
    purchasedAmount: data.totalWeight,
    batchNumbers: data.batchNumbers,
    stockLeft: stockLeft[itemName] || 0
  }));
  
  // Filter table data
  const filteredTableData = tableData.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle stock left input change
  const handleStockLeftChange = (itemName: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setStockLeft(prev => ({
      ...prev,
      [itemName]: numValue
    }));
  };
  
  // Calculate estimated sales
  const calculateEstimatedSaleForItem = (purchased: number, remaining: number) => {
    return calculateEstimatedSales(purchased, remaining);
  };
  
  // Handle save
  const handleSave = async () => {
    // Validate entries
    const allEntered = tableData.every(item => stockLeft[item.itemName] !== undefined);
    
    if (!allEntered) {
      toast({
        title: "Incomplete Entries",
        description: "Please enter remaining stock for all items",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSaving(true);
      const today = getTodayFormatted();
      
      // Save each stock left entry to Supabase
      for (const item of tableData) {
        const estimatedSales = calculateEstimatedSaleForItem(
          item.purchasedAmount, 
          stockLeft[item.itemName] || 0
        );
        
        await addStockLeftEntry({
          date: today,
          itemName: item.itemName,
          purchasedAmount: item.purchasedAmount,
          remainingAmount: stockLeft[item.itemName] || 0,
          estimatedSales
        });
      }
      
      toast({
        title: "Night Entry Saved",
        description: "Stock left has been recorded successfully",
      });
      
      // Clear form after save
      setStockLeft({});
    } catch (error) {
      console.error('Error saving stock left entries:', error);
      toast({
        title: "Error Saving Entries",
        description: "Could not save the stock left entries. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Reset form
  const handleReset = () => {
    setStockLeft({});
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Stock Left (Night Entry)</h1>
      <p className="text-muted-foreground mb-8">
        Record the remaining stock at the end of the day
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>Enter Remaining Stock</CardTitle>
            <CardDescription>
              For each item, enter how much stock is left at the end of the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by item name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-2 text-muted-foreground">Loading today's stock data...</p>
                </div>
              ) : (
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[220px] font-medium">Item Name</TableHead>
                        <TableHead className="font-medium">Batch Numbers</TableHead>
                        <TableHead className="font-medium text-right">Purchased Amount</TableHead>
                        <TableHead className="font-medium text-right w-[180px]">Stock Left (Kg)</TableHead>
                        <TableHead className="font-medium text-right">Estimated Sales</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTableData.length > 0 ? (
                        filteredTableData.map((item) => {
                          const estimatedSales = calculateEstimatedSaleForItem(
                            item.purchasedAmount, 
                            stockLeft[item.itemName] || 0
                          );
                          
                          return (
                            <TableRow key={item.itemName}>
                              <TableCell className="font-medium flex items-center">
                                <BatchIndicator ageInDays={0} className="mr-2" />
                                {item.itemName}
                              </TableCell>
                              <TableCell className="text-xs">
                                <div className="flex flex-wrap gap-1">
                                  {item.batchNumbers.map((batch, index) => (
                                    <span key={batch} className="bg-secondary px-1.5 py-0.5 rounded-full">
                                      {batch}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatWeight(item.purchasedAmount)}
                              </TableCell>
                              <TableCell>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max={item.purchasedAmount}
                                  value={stockLeft[item.itemName] || ""}
                                  onChange={(e) => handleStockLeftChange(item.itemName, e.target.value)}
                                  className="input-field text-right"
                                  placeholder="0.0"
                                />
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {estimatedSales > 0 ? (
                                  <span className="text-fresh font-medium">{formatWeight(estimatedSales)}</span>
                                ) : (
                                  <span className="text-muted-foreground">Pending input</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            {searchTerm ? "No items found matching your search." : "No stock purchases recorded for today."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="button-outline flex items-center"
                  disabled={isSaving || isLoading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="button-primary flex items-center"
                  disabled={isSaving || isLoading}
                >
                  {isSaving ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save Night Entry"}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Night Entry Guide</CardTitle>
            <CardDescription>
              Instructions for accurate stock left recording
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <Check className="h-4 w-4 text-fresh mr-2" />
                When to Record
              </h3>
              <p className="text-sm text-muted-foreground">
                Complete the night entry before closing time (5 PM) to ensure accurate sales estimation.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <Check className="h-4 w-4 text-fresh mr-2" />
                How to Measure
              </h3>
              <p className="text-sm text-muted-foreground">
                Weigh all remaining stock accurately to 0.1 kg precision. Include all displayed and stored stock.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <Check className="h-4 w-4 text-fresh mr-2" />
                Estimated Sales
              </h3>
              <p className="text-sm text-muted-foreground">
                The system automatically calculates:
                <br />
                <strong>Estimated Sales = Stock Purchased - Stock Left</strong>
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center">
                <Check className="h-4 w-4 text-fresh mr-2" />
                Batch Tracking
              </h3>
              <p className="text-sm text-muted-foreground">
                Older stock should be sold first (FIFO). The system will automatically track batch aging.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Once submitted, night entries cannot be modified. Ensure all data is accurate before saving.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockLeft;

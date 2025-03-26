
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EntryTime } from "@/utils/stockUtils";
import StockForm from "@/components/StockForm";
import { useState, useEffect } from "react";
import StockTable, { StockItem } from "@/components/StockTable";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchStockPurchasesByDateAndTime } from "@/utils/supabaseHelpers";
import { getTodayFormatted } from "@/utils/stockUtils";

const StockEntry = () => {
  const [activeTab, setActiveTab] = useState<EntryTime>(EntryTime.MORNING);
  const [stockPurchases, setStockPurchases] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch stock entries for the current date and time
  const fetchCurrentTimeEntries = async () => {
    setIsLoading(true);
    try {
      const todayFormatted = getTodayFormatted();
      const entries = await fetchStockPurchasesByDateAndTime(todayFormatted, activeTab);
      
      // Convert entries to StockItem format
      const formattedEntries: StockItem[] = entries.map(entry => ({
        id: entry.id,
        date: entry.date,
        time: entry.time,
        itemName: entry.itemName,
        batchNo: entry.batchNo,
        weight: entry.weight,
        ratePerKg: entry.ratePerKg,
        totalCost: entry.totalCost
      }));
      
      setStockPurchases(formattedEntries);
    } catch (error) {
      console.error('Error fetching stock entries:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data on component mount and when tab changes
  useEffect(() => {
    fetchCurrentTimeEntries();
  }, [activeTab]);
  
  const handleAddStock = (newStock: StockItem) => {
    // Optimistically add the new stock to the local state
    setStockPurchases(prev => [newStock, ...prev]);
    
    // Refresh the data from the server to get the correct IDs and any other updates
    fetchCurrentTimeEntries();
  };
  
  return (
    <div className="page-container mt-20 px-4 md:px-6 max-w-7xl mx-auto">
      <h1 className="page-title">Stock Entry</h1>
      <p className="text-muted-foreground mb-8">
        Record new stock purchases for your inventory
      </p>
      
      <Tabs 
        defaultValue={EntryTime.MORNING} 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as EntryTime)}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value={EntryTime.MORNING} className="text-sm">Morning Entry (6 AM - 9 AM)</TabsTrigger>
          <TabsTrigger value={EntryTime.NOON} className="text-sm">Noon Entry (12 PM)</TabsTrigger>
        </TabsList>
        
        <TabsContent value={EntryTime.MORNING} className="space-y-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Morning Stock</h2>
              <StockForm time={EntryTime.MORNING} onAddStock={handleAddStock} />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Entry Guidelines</h2>
              <div className="neo-card p-6 space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Morning entries should be completed between 6 AM and 9 AM.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <h3 className="text-sm font-semibold mb-2">Tips for accurate entries:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Measure weight accurately to 0.1 kg precision</li>
                    <li>Verify the rate per kg before entry</li>
                    <li>Each batch gets a unique identifier automatically</li>
                    <li>Double-check all entries before submitting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Today's Morning Entries</h2>
            {isLoading ? (
              <div className="text-center py-8 neo-card">
                <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-muted-foreground">Loading entries...</p>
              </div>
            ) : stockPurchases.length > 0 ? (
              <StockTable data={stockPurchases} showTime={false} />
            ) : (
              <div className="text-center py-8 neo-card">
                <p className="text-muted-foreground">No morning entries for today yet. Add your first entry above.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value={EntryTime.NOON} className="space-y-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Noon Stock</h2>
              <StockForm time={EntryTime.NOON} onAddStock={handleAddStock} />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Entry Guidelines</h2>
              <div className="neo-card p-6 space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Noon entries should record any additional stock purchased after the morning entry.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <h3 className="text-sm font-semibold mb-2">When to use noon entry:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Additional stock purchased after morning</li>
                    <li>Special orders received during the day</li>
                    <li>Replenishment of fast-moving items</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Today's Noon Entries</h2>
            {isLoading ? (
              <div className="text-center py-8 neo-card">
                <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-muted-foreground">Loading entries...</p>
              </div>
            ) : stockPurchases.length > 0 ? (
              <StockTable data={stockPurchases} showTime={false} />
            ) : (
              <div className="text-center py-8 neo-card">
                <p className="text-muted-foreground">No noon entries for today yet. Add your first entry above.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockEntry;


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EntryTime } from "@/utils/stockUtils";
import StockForm from "@/components/StockForm";
import { stockPurchases } from "@/data/mockData";
import { useState } from "react";
import StockTable from "@/components/StockTable";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const StockEntry = () => {
  const [activeTab, setActiveTab] = useState<EntryTime>(EntryTime.MORNING);
  const [localStockPurchases, setLocalStockPurchases] = useState(stockPurchases);
  
  const handleAddStock = (newStock: any) => {
    setLocalStockPurchases([newStock, ...localStockPurchases]);
  };
  
  // Filter stock entries for the current day and time
  const getCurrentTimeEntries = () => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    return localStockPurchases.filter(
      item => item.date === formattedDate && item.time === activeTab
    );
  };
  
  const currentTimeEntries = getCurrentTimeEntries();
  
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
            {currentTimeEntries.length > 0 ? (
              <StockTable data={currentTimeEntries} showTime={false} />
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
            {currentTimeEntries.length > 0 ? (
              <StockTable data={currentTimeEntries} showTime={false} />
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

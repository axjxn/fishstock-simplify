
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EntryTime, formatDate } from "@/utils/stockUtils";
import StockForm from "@/components/StockForm";
import { stockPurchases } from "@/data/mockData";
import { useState } from "react";
import StockTable from "@/components/StockTable";
import { AlertCircle, Calendar } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const StockEntry = () => {
  const [activeTab, setActiveTab] = useState<EntryTime>(EntryTime.MORNING);
  const [localStockPurchases, setLocalStockPurchases] = useState(stockPurchases);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const handleAddStock = (newStock: any) => {
    setLocalStockPurchases([newStock, ...localStockPurchases]);
  };
  
  // Filter stock entries for the selected date and time
  const getCurrentTimeEntries = () => {
    const formattedDate = formatDate(selectedDate);
    
    return localStockPurchases.filter(
      item => item.date === formattedDate && item.time === activeTab
    );
  };
  
  const currentTimeEntries = getCurrentTimeEntries();
  
  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="page-title">Stock Entry</h1>
          <p className="text-muted-foreground">
            Record new stock purchases for your inventory
          </p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {format(selectedDate, "dd MMMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Tabs 
        defaultValue={EntryTime.MORNING} 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as EntryTime)}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value={EntryTime.MORNING}>Morning Entry (6 AM - 9 AM)</TabsTrigger>
          <TabsTrigger value={EntryTime.NOON}>Noon Entry (12 PM)</TabsTrigger>
          <TabsTrigger value={EntryTime.EVENING}>Evening Entry (4 PM - 6 PM)</TabsTrigger>
        </TabsList>
        
        <TabsContent value={EntryTime.MORNING} className="space-y-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Morning Stock</h2>
              <StockForm time={EntryTime.MORNING} onAddStock={handleAddStock} selectedDate={selectedDate} />
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
            <h2 className="text-xl font-semibold mb-4">Morning Entries for {format(selectedDate, "dd MMMM yyyy")}</h2>
            {currentTimeEntries.length > 0 ? (
              <StockTable data={currentTimeEntries} showTime={false} />
            ) : (
              <div className="text-center py-8 neo-card">
                <p className="text-muted-foreground">No morning entries for this date yet. Add your first entry above.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value={EntryTime.NOON} className="space-y-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Noon Stock</h2>
              <StockForm time={EntryTime.NOON} onAddStock={handleAddStock} selectedDate={selectedDate} />
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
            <h2 className="text-xl font-semibold mb-4">Noon Entries for {format(selectedDate, "dd MMMM yyyy")}</h2>
            {currentTimeEntries.length > 0 ? (
              <StockTable data={currentTimeEntries} showTime={false} />
            ) : (
              <div className="text-center py-8 neo-card">
                <p className="text-muted-foreground">No noon entries for this date yet. Add your first entry above.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value={EntryTime.EVENING} className="space-y-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Evening Stock</h2>
              <StockForm time={EntryTime.EVENING} onAddStock={handleAddStock} selectedDate={selectedDate} />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Entry Guidelines</h2>
              <div className="neo-card p-6 space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Evening entries should be completed between 4 PM and 6 PM for late arrivals.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <h3 className="text-sm font-semibold mb-2">When to use evening entry:</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Late arrival stock received in the evening</li>
                    <li>Special deliveries or unexpected shipments</li>
                    <li>Additional purchases for high-demand items</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Evening Entries for {format(selectedDate, "dd MMMM yyyy")}</h2>
            {currentTimeEntries.length > 0 ? (
              <StockTable data={currentTimeEntries} showTime={false} />
            ) : (
              <div className="text-center py-8 neo-card">
                <p className="text-muted-foreground">No evening entries for this date yet. Add your first entry above.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockEntry;

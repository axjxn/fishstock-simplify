
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { stockMovementReports, stockPurchases } from "@/data/mockData";
import { formatCurrency, formatWeight } from "@/utils/stockUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { FileDown, FileText, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BatchIndicator from "@/components/BatchIndicator";
import { calculateAgeInDays } from "@/utils/stockUtils";
import { useState } from "react";

const Reports = () => {
  const { toast } = useToast();
  const [dateFilter, setDateFilter] = useState<string>("");

  // Handler for export functionality
  const handleExport = (format: "excel" | "pdf") => {
    // This would connect to actual export functionality
    toast({
      title: `Export to ${format.toUpperCase()} started`,
      description: "Your report will be ready to download shortly",
    });
  };
  
  // Prepare data for charts
  const salesData = stockMovementReports.map(report => ({
    name: report.itemName.split(' ')[0], // First word of item name
    sales: report.estimatedSales,
    cost: report.totalPurchaseCost / 1000, // Convert to thousands for better scale
  }));
  
  // Filter stock movement reports
  const filteredReports = dateFilter 
    ? stockMovementReports.filter(report => report.date === dateFilter)
    : stockMovementReports;
  
  // Get unique dates for filter
  const uniqueDates = [...new Set(stockMovementReports.map(report => report.date))];
  
  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="text-muted-foreground">
            View and export detailed stock reports
          </p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => handleExport("excel")}
            className="button-outline flex items-center text-sm"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export Excel
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="button-outline flex items-center text-sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>
      
      <Tabs defaultValue="movement" className="space-y-6">
        <TabsList>
          <TabsTrigger value="movement">Stock Movement</TabsTrigger>
          <TabsTrigger value="aging">Stock Aging</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="movement" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <CardTitle>Stock Movement Report</CardTitle>
                  <CardDescription>
                    Daily summary of stock purchases, remaining stock, and estimated sales
                  </CardDescription>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="input-field text-sm h-9 w-auto"
                  >
                    <option value="">All Dates</option>
                    {uniqueDates.map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] font-medium">Date</TableHead>
                      <TableHead className="font-medium">Item</TableHead>
                      <TableHead className="font-medium text-right">Stock Purchased</TableHead>
                      <TableHead className="font-medium text-right">Stock Left</TableHead>
                      <TableHead className="font-medium text-right">Estimated Sales</TableHead>
                      <TableHead className="font-medium text-right">Total Purchase Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report, index) => (
                        <TableRow key={`${report.date}-${report.itemName}`}>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>{report.itemName}</TableCell>
                          <TableCell className="text-right">{formatWeight(report.stockPurchased)}</TableCell>
                          <TableCell className="text-right">{formatWeight(report.stockLeft)}</TableCell>
                          <TableCell className="text-right text-fresh">{formatWeight(report.estimatedSales)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(report.totalPurchaseCost)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No stock movement data available for the selected filter.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="aging" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Stock Aging Report</CardTitle>
              <CardDescription>
                Monitor stock freshness and identify items requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">Item Name</TableHead>
                      <TableHead className="font-medium">Batch No.</TableHead>
                      <TableHead className="font-medium">Purchase Date</TableHead>
                      <TableHead className="font-medium">Age</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium text-right">Remaining Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockPurchases.map((item) => {
                      const ageInDays = calculateAgeInDays(item.date);
                      
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.itemName}</TableCell>
                          <TableCell>{item.batchNo}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{ageInDays} {ageInDays === 1 ? 'day' : 'days'}</TableCell>
                          <TableCell>
                            <BatchIndicator ageInDays={ageInDays} showLabel />
                          </TableCell>
                          <TableCell className="text-right">{formatWeight(item.weight)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center mt-6 p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-fresh mr-2"></div>
                    <span className="text-sm">Fresh (0-1 days)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-moderate mr-2"></div>
                    <span className="text-sm">Moderate (2 days)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-urgent mr-2"></div>
                    <span className="text-sm">Urgent Sale (3+ days)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Item (Kg)</CardTitle>
                <CardDescription>
                  Estimated sales volume for each fish type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} Kg`, 'Sales']} />
                      <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Purchase Cost Trend (₹'000)</CardTitle>
                <CardDescription>
                  Trend of purchase costs over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${(value * 1000).toLocaleString()}`, 'Cost']} />
                      <Line type="monotone" dataKey="cost" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;

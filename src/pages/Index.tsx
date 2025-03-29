
import { BarChart3, Fish, TrendingDown, TrendingUp, AlertTriangle, Package, Timer } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import { formatCurrency, formatWeight } from "@/utils/stockUtils";
import { fishTypes } from "@/data/mockData";
import BatchIndicator from "@/components/BatchIndicator";
import StockTable, { StockItem } from "@/components/StockTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { fetchStockPurchases, fetchStockLeftEntries } from "@/utils/supabaseHelpers";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { getTodayFormatted } from "@/utils/stockUtils";

const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa", "#c084fc", "#34d399"];

const Dashboard = () => {
  const { 
    data: stockPurchases = [], 
    isLoading: isLoadingPurchases 
  } = useQuery({
    queryKey: ['stockPurchases'],
    queryFn: fetchStockPurchases,
  });

  const { 
    data: stockLeftEntries = [], 
    isLoading: isLoadingStockLeft 
  } = useQuery({
    queryKey: ['stockLeftEntries'],
    queryFn: fetchStockLeftEntries,
  });

  // Calculate dashboard stats from real data
  const todayFormatted = getTodayFormatted();
  
  // Filter today's purchases
  const todayPurchases = stockPurchases.filter(item => item.date === todayFormatted);
  
  // Calculate total weight purchased today
  const totalPurchasesToday = todayPurchases.reduce((total, item) => total + item.weight, 0);
  
  // Calculate total value of current stock
  const totalValue = stockPurchases.reduce((total, item) => total + item.totalCost, 0);
  
  // Calculate total current stock weight
  const totalStock = stockPurchases.reduce((total, item) => total + item.weight, 0);
  
  // Get latest stock left entry for today (if any)
  const todayStockLeft = stockLeftEntries.find(item => item.date === todayFormatted);
  const estimatedSalesToday = todayStockLeft ? todayStockLeft.estimatedSales : 0;
  
  // Count items older than 2 days
  const oldStockCount = stockPurchases.filter(item => {
    const purchaseDate = new Date(item.date.split('-').reverse().join('-'));
    const today = new Date();
    const differenceInTime = today.getTime() - purchaseDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays >= 2;
  }).length;
  
  // Determine fast-moving items based on estimated sales
  const itemSales: Record<string, number> = {};
  stockLeftEntries.forEach(entry => {
    if (!itemSales[entry.itemName]) {
      itemSales[entry.itemName] = 0;
    }
    itemSales[entry.itemName] += entry.estimatedSales;
  });
  
  const fastMovingItems = Object.entries(itemSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([itemName]) => itemName);
  
  // Generate stock alerts based on data
  const stockAlerts = [
    ...stockPurchases
      .filter(item => {
        const purchaseDate = new Date(item.date.split('-').reverse().join('-'));
        const today = new Date();
        const differenceInTime = today.getTime() - purchaseDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays >= 2;
      })
      .map((item, index) => {
        const purchaseDate = new Date(item.date.split('-').reverse().join('-'));
        const today = new Date();
        const differenceInTime = today.getTime() - purchaseDate.getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        
        return {
          id: index + 1,
          type: 'aging' as const,
          itemName: item.itemName,
          batchNo: item.batchNo,
          message: `Stock is ${differenceInDays} days old. ${differenceInDays >= 3 ? 'Consider urgent sale.' : 'Monitor closely.'}`,
          date: todayFormatted,
          severity: differenceInDays >= 3 ? 'urgent' as const : 'warning' as const
        };
      })
  ].slice(0, 4);  // Limit to 4 alerts

  // Prepare data for pie chart
  const stockDistribution = stockPurchases.reduce((acc, item) => {
    const existingItem = acc.find(i => i.name === item.itemName);
    if (existingItem) {
      existingItem.value += item.weight;
    } else {
      acc.push({ name: item.itemName, value: item.weight });
    }
    return acc;
  }, [] as { name: string; value: number }[]).slice(0, 6); // Limit to top 6 items
  
  const isLoading = isLoadingPurchases || isLoadingStockLeft;
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your fish stock inventory and sales
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <Timer className="w-3 h-3 mr-1" /> 
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <DashboardCard
          title="Total Stock"
          value={formatWeight(totalStock)}
          icon={<Fish className="h-6 w-6" />}
          trend={null}
        />
        <DashboardCard
          title="Stock Value"
          value={formatCurrency(totalValue)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={null}
        />
        <DashboardCard
          title="Today's Purchases"
          value={formatWeight(totalPurchasesToday)}
          icon={<Package className="h-6 w-6" />}
        />
        <DashboardCard
          title="Today's Sales"
          value={estimatedSalesToday > 0 ? 
            formatWeight(estimatedSalesToday) : 
            "Pending (Night Entry)"}
          icon={<TrendingDown className="h-6 w-6" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>Recent Stock Entries</CardTitle>
            <CardDescription>
              Latest stock purchases and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stockPurchases.length > 0 ? (
              <StockTable data={stockPurchases.slice(0, 5)} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No stock entries found. Start by adding stock entries from the Stock Entry page.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
            <CardDescription>
              Current inventory by fish type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stockDistribution.length > 0 ? (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {stockDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value, name, props) => [
                        `${value} Kg`, 
                        props.payload.name
                      ]} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No stock data available to display distribution.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Stock Alerts</CardTitle>
            <CardDescription>
              Important notifications about your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stockAlerts.length > 0 ? (
                stockAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="flex items-start p-3 rounded-lg border border-border bg-secondary/30"
                  >
                    <div className={`rounded-full p-2 mr-3 ${
                      alert.severity === 'urgent' ? 'bg-urgent-light text-urgent' :
                      alert.severity === 'warning' ? 'bg-moderate-light text-moderate' :
                      'bg-primary/10 text-primary'
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-sm">{alert.itemName}</h4>
                        {alert.type === 'aging' && (
                          <div className="ml-2">
                            <BatchIndicator 
                              ageInDays={
                                alert.severity === 'urgent' ? 3 :
                                alert.severity === 'warning' ? 2 : 1
                              } 
                              showLabel
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {alert.date}
                        </span>
                        {alert.batchNo && (
                          <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-full">
                            {alert.batchNo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No alerts at this time. Alerts will appear when stock ages or other issues arise.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Fast Moving Items</CardTitle>
            <CardDescription>
              Items with high sales velocity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fastMovingItems.length > 0 ? (
                fastMovingItems.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30"
                  >
                    <div className="flex items-center">
                      <div className="bg-primary/10 text-primary rounded-full p-2 mr-3">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{item}</h4>
                        <p className="text-xs text-muted-foreground">Consistently selling well</p>
                      </div>
                    </div>
                    <div className="bg-fresh-light text-fresh text-xs font-medium px-2 py-1 rounded-full">
                      High Demand
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No sales data available yet. Complete night entries to see fast-moving items.</p>
                </div>
              )}
              
              {fastMovingItems.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Consider ordering more of these items for tomorrow's stock.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

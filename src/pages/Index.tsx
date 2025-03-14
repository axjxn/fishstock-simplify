
import { BarChart3, Fish, TrendingDown, TrendingUp, AlertTriangle, Package, Timer } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import { formatCurrency, formatWeight } from "@/utils/stockUtils";
import { dashboardStats, stockAlerts, stockPurchases } from "@/data/mockData";
import BatchIndicator from "@/components/BatchIndicator";
import StockTable from "@/components/StockTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa", "#c084fc", "#34d399"];

const Dashboard = () => {
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
  
  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Dashboard</h1>
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
          value={formatWeight(dashboardStats.totalStock)}
          icon={<Fish className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Stock Value"
          value={formatCurrency(dashboardStats.totalValue)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Today's Purchases"
          value={formatWeight(dashboardStats.totalPurchasesToday)}
          icon={<Package className="h-6 w-6" />}
        />
        <DashboardCard
          title="Today's Sales"
          value={dashboardStats.estimatedSalesToday > 0 ? 
            formatWeight(dashboardStats.estimatedSalesToday) : 
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
            <StockTable data={stockPurchases.slice(0, 5)} />
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
              {stockAlerts.map((alert) => (
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
              ))}
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
              {dashboardStats.fastMovingItems.map((item, index) => (
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
              ))}
              
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Consider ordering more of these items for tomorrow's stock.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

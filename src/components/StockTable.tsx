
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateAgeInDays, formatCurrency, formatWeight } from "@/utils/stockUtils";
import BatchIndicator from "./BatchIndicator";
import { useState } from "react";
import { Search } from "lucide-react";

interface StockItem {
  id: string;
  date: string;
  time?: string;
  itemName: string;
  batchNo: string;
  weight: number;
  ratePerKg: number;
  totalCost: number;
}

interface StockTableProps {
  data: StockItem[];
  showTime?: boolean;
}

const StockTable = ({ data, showTime = true }: StockTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredData = data.filter(item => 
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search by item or batch number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>
      
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px] font-medium">Item Name</TableHead>
              {showTime && <TableHead className="font-medium">Time</TableHead>}
              <TableHead className="font-medium">Batch No.</TableHead>
              <TableHead className="font-medium">Age</TableHead>
              <TableHead className="font-medium">Weight</TableHead>
              <TableHead className="font-medium text-right">Rate/Kg</TableHead>
              <TableHead className="font-medium text-right">Total Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const ageInDays = calculateAgeInDays(item.date);
                return (
                  <TableRow key={item.id} className="group">
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    {showTime && <TableCell>{item.time}</TableCell>}
                    <TableCell>{item.batchNo}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <BatchIndicator ageInDays={ageInDays} />
                        <span>{ageInDays} {ageInDays === 1 ? "day" : "days"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatWeight(item.weight)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.ratePerKg)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.totalCost)}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={showTime ? 7 : 6} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No items found. Try a different search term." : "No items available yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockTable;

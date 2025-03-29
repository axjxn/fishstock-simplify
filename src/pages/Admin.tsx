
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StockItem } from "@/components/StockTable";
import { Spinner } from "@/components/ui/spinner";
import { deleteAllStockPurchases, deleteAllStockLeftEntries } from "@/utils/supabaseHelpers";

const Admin = () => {
  const { toast } = useToast();
  const [stockPurchases, setStockPurchases] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [editForm, setEditForm] = useState({
    itemName: "",
    weight: "",
    ratePerKg: "",
    totalCost: ""
  });

  // Fetch stock entries from Supabase
  const fetchStockPurchases = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('stock_purchases')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching stock purchases:', error);
        toast({
          title: "Error fetching data",
          description: error.message,
          variant: "destructive"
        });
        setStockPurchases([]);
        setIsLoading(false);
        return;
      }
      
      if (!data || data.length === 0) {
        setStockPurchases([]);
        setIsLoading(false);
        return;
      }
      
      // Convert DB format to app format
      const formattedData: StockItem[] = data.map(item => ({
        id: item.id,
        date: item.date,
        time: item.time,
        itemName: item.item_name,
        batchNo: item.batch_no,
        weight: Number(item.weight),
        ratePerKg: Number(item.rate_per_kg),
        totalCost: Number(item.total_cost)
      }));
      
      setStockPurchases(formattedData);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "An error occurred",
        description: "Could not fetch stock data",
        variant: "destructive"
      });
      setStockPurchases([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchStockPurchases();
  }, []);

  // Handle edit dialog open
  const handleEditOpen = (item: StockItem) => {
    setEditingItem(item);
    setEditForm({
      itemName: item.itemName,
      weight: String(item.weight),
      ratePerKg: String(item.ratePerKg),
      totalCost: String(item.totalCost)
    });
  };

  // Handle form change
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingItem) return;

    const weight = parseFloat(editForm.weight);
    const ratePerKg = parseFloat(editForm.ratePerKg);
    const totalCost = parseFloat(editForm.totalCost);

    if (isNaN(weight) || isNaN(ratePerKg) || isNaN(totalCost)) {
      toast({
        title: "Invalid input",
        description: "Please enter valid numbers for numeric fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('stock_purchases')
        .update({
          item_name: editForm.itemName,
          weight: weight,
          rate_per_kg: ratePerKg,
          total_cost: totalCost
        })
        .eq('id', String(editingItem.id));

      if (error) {
        throw error;
      }

      // Update local state
      const updatedItems = stockPurchases.map(item => 
        item.id === editingItem.id 
          ? {
              ...item,
              itemName: editForm.itemName,
              weight,
              ratePerKg,
              totalCost
            } 
          : item
      );

      setStockPurchases(updatedItems);
      setEditingItem(null);
      
      toast({
        title: "Item updated",
        description: `${editForm.itemName} has been updated successfully.`
      });
    } catch (error: any) {
      console.error('Error updating item:', error);
      toast({
        title: "Update failed",
        description: error.message || "Could not update the item",
        variant: "destructive"
      });
    }
  };

  // Handle delete item
  const handleDeleteItem = async (id: string | number) => {
    try {
      const { error } = await supabase
        .from('stock_purchases')
        .delete()
        .eq('id', String(id));

      if (error) {
        throw error;
      }

      // Update local state
      const updatedItems = stockPurchases.filter(item => item.id !== id);
      setStockPurchases(updatedItems);
      
      toast({
        title: "Item deleted",
        description: "The item has been deleted successfully."
      });
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Could not delete the item",
        variant: "destructive"
      });
    }
  };

  // Handle reset all data - this will delete all records from both stock_purchases and stock_left tables
  const handleResetData = async () => {
    setIsResetting(true);
    try {
      // Use the helper functions to delete all data
      await deleteAllStockPurchases();
      await deleteAllStockLeftEntries();

      // Clear local state
      setStockPurchases([]);
      
      toast({
        title: "Data reset",
        description: "All stock data has been reset successfully."
      });
    } catch (error: any) {
      console.error('Error resetting data:', error);
      toast({
        title: "Reset failed",
        description: error.message || "Could not reset the data",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="page-container mt-20 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title">Admin Portal</h1>
          <p className="text-muted-foreground">
            Manage stock entries, modify values, and reset data
          </p>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2" disabled={isResetting}>
              {isResetting ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Resetting...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Reset All Data
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete all stock data in the system. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetData}>Reset All Data</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="neo-card p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Manage Stock Data</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner className="h-8 w-8 mr-2" />
            <span>Loading stock data...</span>
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px] font-medium">Item Name</TableHead>
                  <TableHead className="font-medium">Batch No.</TableHead>
                  <TableHead className="font-medium">Date</TableHead>
                  <TableHead className="font-medium">Weight (kg)</TableHead>
                  <TableHead className="font-medium text-right">Rate/Kg (₹)</TableHead>
                  <TableHead className="font-medium text-right">Total Cost (₹)</TableHead>
                  <TableHead className="font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockPurchases.length > 0 ? (
                  stockPurchases.map((item) => (
                    <TableRow key={item.id.toString()} className="group">
                      <TableCell className="font-medium">{item.itemName}</TableCell>
                      <TableCell>{item.batchNo}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.weight}</TableCell>
                      <TableCell className="text-right">{item.ratePerKg}</TableCell>
                      <TableCell className="text-right">{item.totalCost}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditOpen(item)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Stock Entry</DialogTitle>
                                <DialogDescription>
                                  Make changes to the stock entry below.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="itemName">Item Name</Label>
                                  <Input 
                                    id="itemName" 
                                    name="itemName" 
                                    value={editForm.itemName} 
                                    onChange={handleEditFormChange} 
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input 
                                      id="weight" 
                                      name="weight" 
                                      type="number" 
                                      step="0.1" 
                                      value={editForm.weight} 
                                      onChange={handleEditFormChange} 
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="ratePerKg">Rate per Kg (₹)</Label>
                                    <Input 
                                      id="ratePerKg" 
                                      name="ratePerKg" 
                                      type="number" 
                                      value={editForm.ratePerKg} 
                                      onChange={handleEditFormChange} 
                                    />
                                  </div>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="totalCost">Total Cost (₹)</Label>
                                  <Input 
                                    id="totalCost" 
                                    name="totalCost" 
                                    type="number" 
                                    value={editForm.totalCost} 
                                    onChange={handleEditFormChange} 
                                  />
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button type="submit" onClick={handleSaveEdit}>Save changes</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 w-8 p-0 border-destructive text-destructive hover:bg-destructive/10"
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this stock entry from the system.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No stock entries found. Start by adding stock entries from the Stock Entry page.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

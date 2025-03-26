
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash, RefreshCw } from "lucide-react";
import { stockPurchases } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { toast } = useToast();
  const [localStockPurchases, setLocalStockPurchases] = useState(stockPurchases);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    itemName: "",
    weight: "",
    ratePerKg: "",
    totalCost: ""
  });

  // Handle edit dialog open
  const handleEditOpen = (item: any) => {
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
  const handleSaveEdit = () => {
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

    const updatedItems = localStockPurchases.map(item => 
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

    setLocalStockPurchases(updatedItems);
    setEditingItem(null);
    
    toast({
      title: "Item updated",
      description: `${editForm.itemName} has been updated successfully.`
    });
  };

  // Handle delete item
  const handleDeleteItem = (id: number) => {
    const updatedItems = localStockPurchases.filter(item => item.id !== id);
    setLocalStockPurchases(updatedItems);
    
    toast({
      title: "Item deleted",
      description: "The item has been deleted successfully."
    });
  };

  // Handle reset all data
  const handleResetData = () => {
    setLocalStockPurchases([]);
    
    toast({
      title: "Data reset",
      description: "All stock data has been reset successfully."
    });
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
            <Button variant="destructive" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset All Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will clear all stock data in the system. This action cannot be undone.
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
              {localStockPurchases.length > 0 ? (
                localStockPurchases.map((item) => (
                  <TableRow key={item.id} className="group">
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
                    No stock entries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Admin;

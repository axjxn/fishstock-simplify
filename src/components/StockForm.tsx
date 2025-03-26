
import { useState } from "react";
import { fishTypes } from "@/data/mockData";
import { calculateTotalCost, EntryTime, generateBatchNumber, getTodayFormatted } from "@/utils/stockUtils";
import { Search, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addStockPurchase } from "@/utils/supabaseHelpers";

interface StockFormProps {
  time: EntryTime;
  onAddStock?: (data: any) => void;
}

const StockForm = ({ time, onAddStock }: StockFormProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    itemName: "",
    weight: "",
    ratePerKg: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredFish, setFilteredFish] = useState<string[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [totalCost, setTotalCost] = useState<number | null>(null);

  // Handle fish name search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 0) {
      const filtered = fishTypes.filter(fish => 
        fish.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFish(filtered);
      setShowSearchResults(true);
    } else {
      setFilteredFish([]);
      setShowSearchResults(false);
    }
  };

  // Select fish from dropdown
  const selectFish = (fish: string) => {
    setFormData({ ...formData, itemName: fish });
    setSearchTerm(fish);
    setShowSearchResults(false);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Calculate total cost when weight or rate changes
    if ((name === 'weight' || name === 'ratePerKg') && formData.weight && formData.ratePerKg) {
      const weight = name === 'weight' ? parseFloat(value) : parseFloat(formData.weight);
      const rate = name === 'ratePerKg' ? parseFloat(value) : parseFloat(formData.ratePerKg);
      
      if (!isNaN(weight) && !isNaN(rate)) {
        setTotalCost(calculateTotalCost(weight, rate));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.itemName || !formData.weight || !formData.ratePerKg) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get today's date
      const formattedDate = getTodayFormatted();
      const weight = parseFloat(formData.weight);
      const ratePerKg = parseFloat(formData.ratePerKg);
      const calculatedTotalCost = calculateTotalCost(weight, ratePerKg);
      
      // Create stock entry
      const newStock = {
        date: formattedDate,
        time,
        itemName: formData.itemName,
        batchNo: generateBatchNumber(),
        weight,
        ratePerKg,
        totalCost: calculatedTotalCost
      };
      
      // Save to Supabase
      await addStockPurchase(newStock);
      
      // Call onAddStock callback if provided
      if (onAddStock) {
        onAddStock({
          id: Date.now().toString(), // This ID will be replaced when the list refreshes from DB
          ...newStock
        });
      }
      
      // Show success toast
      toast({
        title: "Stock entry added",
        description: `Added ${formData.weight} Kg of ${formData.itemName}`,
      });
      
      // Reset form
      setFormData({
        itemName: "",
        weight: "",
        ratePerKg: "",
      });
      setSearchTerm("");
      setTotalCost(null);
    } catch (error) {
      toast({
        title: "Error adding stock",
        description: "Could not save the stock entry. Please try again.",
        variant: "destructive"
      });
      console.error("Error saving stock entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Clear form
  const clearForm = () => {
    setFormData({
      itemName: "",
      weight: "",
      ratePerKg: "",
    });
    setSearchTerm("");
    setTotalCost(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 neo-card p-6 animate-fade-in">
      <div className="space-y-1.5">
        <label htmlFor="itemName" className="text-sm font-medium">
          Fish Type
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            id="itemName"
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for fish type..."
            className="input-field pl-10"
            autoComplete="off"
          />
          {showSearchResults && filteredFish.length > 0 && (
            <div className="absolute mt-1 w-full bg-white shadow-lg rounded-lg border border-border z-10 max-h-60 overflow-y-auto">
              {filteredFish.map((fish) => (
                <div
                  key={fish}
                  className="px-4 py-2 hover:bg-secondary cursor-pointer text-sm transition-colors"
                  onClick={() => selectFish(fish)}
                >
                  {fish}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="weight" className="text-sm font-medium">
            Weight (Kg)
          </label>
          <input
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            min="0"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="Enter weight in Kg"
            className="input-field"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="ratePerKg" className="text-sm font-medium">
            Rate per Kg (₹)
          </label>
          <input
            id="ratePerKg"
            name="ratePerKg"
            type="number"
            min="0"
            value={formData.ratePerKg}
            onChange={handleInputChange}
            placeholder="Enter rate per Kg"
            className="input-field"
          />
        </div>
      </div>

      {totalCost !== null && (
        <div className="bg-secondary/50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Total Cost:</div>
            <div className="text-lg font-semibold">₹{totalCost.toLocaleString()}</div>
          </div>
        </div>
      )}

      <div className="flex space-x-3 pt-2">
        <button 
          type="submit" 
          className="button-primary flex-1 flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? "Saving..." : "Add Entry"}
        </button>
        <button 
          type="button" 
          onClick={clearForm}
          className="button-outline flex items-center justify-center"
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 mr-2" />
          Clear
        </button>
      </div>
    </form>
  );
};

export default StockForm;

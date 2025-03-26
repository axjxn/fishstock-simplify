
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StockEntry from "./pages/StockEntry";
import StockLeft from "./pages/StockLeft";
import Reports from "./pages/Reports";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Create the query client with better error and retry configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000
    }
  }
});

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            {/* Routes with Navbar */}
            <Route element={<Navbar />}>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              
              {/* Staff only routes */}
              <Route element={<ProtectedRoute requiredRole="staff" />}>
                <Route path="/stock-entry" element={<StockEntry />} />
                <Route path="/stock-left" element={<StockLeft />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
              
              {/* Admin only routes */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;

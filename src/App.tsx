
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
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

// Create the query client outside of the component
const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Navbar />}>
                <Route path="/" element={<Index />} />
                <Route path="/stock-entry" element={<StockEntry />} />
                <Route path="/stock-left" element={<StockLeft />} />
              </Route>
            </Route>
            
            {/* Admin-only routes */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route element={<Navbar />}>
                <Route path="/reports" element={<Reports />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Toasters should be placed at the end */}
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;

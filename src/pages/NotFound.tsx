
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md mx-auto animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-6">
          <AlertTriangle className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          We couldn't find the page you're looking for. The page may have been moved, deleted, or never existed.
        </p>
        
        <Link to="/">
          <Button className="button-primary">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;


import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Fish, ClipboardList, BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: "Dashboard", path: "/", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Stock Entry", path: "/stock-entry", icon: <Fish className="h-4 w-4" /> },
    { name: "Stock Left", path: "/stock-left", icon: <ClipboardList className="h-4 w-4" /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Fish className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">FishStock</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center rounded-full w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-b border-border animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

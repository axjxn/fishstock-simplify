
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Fish, ClipboardList, BarChart3, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Show all navigation items regardless of user role
  const navItems = [
    { name: "Dashboard", path: "/", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Stock Entry", path: "/stock-entry", icon: <Fish className="h-4 w-4" /> },
    { name: "Stock Left", path: "/stock-left", icon: <ClipboardList className="h-4 w-4" /> },
    { name: "Reports", path: "/reports", icon: <BarChart3 className="h-4 w-4" /> },
  ];

  return (
    <>
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

            {/* User menu - only show if user is logged in */}
            {user && (
              <div className="hidden md:flex items-center ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <p className="font-medium">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Sign in link if not logged in */}
            {!user && (
              <div className="hidden md:flex items-center ml-4">
                <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
              </div>
            )}

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

              {/* Sign in link in mobile menu if not logged in */}
              {!user && (
                <Link
                  to="/auth"
                  className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="mr-3 h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Log out button in mobile menu if logged in */}
              {user && (
                <div
                  className="flex items-center px-3 py-3 rounded-lg text-base font-medium text-muted-foreground mt-2 border-t pt-4 cursor-pointer"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log out</span>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* Main content - very important to render below the navbar */}
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;

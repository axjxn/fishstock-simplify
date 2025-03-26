import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Fish, Menu, User } from "lucide-react";
import { useState } from "react";
import { Link, NavLink as RouterNavLink, Outlet } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NavLink = ({ children, to }: { children: React.ReactNode; to: string }) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      isActive
        ? "font-semibold text-primary underline underline-offset-4"
        : "text-muted-foreground hover:text-foreground"
    }
  >
    {children}
  </RouterNavLink>
);

const MobileNav = ({ children }: { children: React.ReactNode }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="sm:w-80">
      <SheetHeader>
        <SheetTitle>Menu</SheetTitle>
        <SheetDescription>
          Navigate through the application using the links below.
        </SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 py-4">
        {children}
      </div>
    </SheetContent>
  </Sheet>
);

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <Fish className="h-6 w-6" />
              <span className="font-bold">FishStock Pro</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/stock-entry">Stock Entry</NavLink>
              <NavLink to="/stock-left">Stock Left</NavLink>
              <NavLink to="/reports">Reports</NavLink>
              <NavLink to="/admin" className="font-semibold text-primary">Admin</NavLink>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <span className="line-clamp-1">
                  {user?.email || "Not signed in"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <MobileNav>
        <NavLink to="/" onClick={closeMobileMenu}>Dashboard</NavLink>
        <NavLink to="/stock-entry" onClick={closeMobileMenu}>Stock Entry</NavLink>
        <NavLink to="/stock-left" onClick={closeMobileMenu}>Stock Left</NavLink>
        <NavLink to="/reports" onClick={closeMobileMenu}>Reports</NavLink>
        <NavLink to="/admin" onClick={closeMobileMenu} className="font-semibold text-primary">Admin</NavLink>
      </MobileNav>
      
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;

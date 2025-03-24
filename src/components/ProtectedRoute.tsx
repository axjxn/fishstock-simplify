
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  requiredRole?: "staff" | "admin";
};

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isStaff } = useAuth();

  // If still loading auth state, show a loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Role-based access control
  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "staff" && !isStaff) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated and has permission, render the route
  return <Outlet />;
};

export default ProtectedRoute;

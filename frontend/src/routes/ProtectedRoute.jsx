import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../hooks/useProfile";
import { useEffect } from "react";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();

  const { data: profile, isLoading } = useProfile({
    enabled: !!token,
  });

  useEffect(() => {
    if (token && !isLoading && !profile && location.pathname !== "/profile") {
      toast("Please complete your profile details to get started!", {
        icon: "👋",
        id: "profile-prompt",
      });
    }
  }, [token, isLoading, profile, location.pathname]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile && location.pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default ProtectedRoute;
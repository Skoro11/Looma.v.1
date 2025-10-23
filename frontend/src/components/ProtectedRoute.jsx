import { useAuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-body)]">
        <img
          src="/looma.png"
          alt="Looma Logo"
          className="w-24 h-24 mb-6 animate-pulse"
        />
        <p className="text-white text-xl font-semibold">Checking session...</p>
      </div>
    );

  if (!isAuthenticated) {
    toast.warning("Token Verification failed");
    return <Navigate to="/login" replace />;
  }

  return children;
}

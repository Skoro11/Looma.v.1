import { createContext, useState, useEffect, useContext } from "react";
import { CheckToken } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  // optional: check token on mount
  useEffect(() => {
    async function verify() {
      try {
        const res = await CheckToken(); // your /me API
        setIsAuthenticated(res.data.success);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Fixed hook
export const useAuthContext = () => useContext(AuthContext);

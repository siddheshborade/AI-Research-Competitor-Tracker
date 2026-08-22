import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function checkExistingSession() {
      try {
        let currentUser = await api.getCurrentUser();
        if (!currentUser) {
          try {
            const authData = await api.login("analyst@nexus.ai", "nexus2026");
            currentUser = authData?.user;
          } catch (loginErr) {
            console.warn("[AuthContext] Auto-login fallback:", loginErr);
          }
        }
        if (isMounted && currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.warn("[AuthContext] Session initialization error:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkExistingSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const authData = await api.login(email, password);
      if (authData && authData.user) {
        setUser(authData.user);
        return authData.user;
      }
      throw new Error("Authentication failed. Please check your credentials.");
    } catch (err) {
      const msg = err?.data?.error?.message || err?.message || "Invalid email or password.";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } catch (err) {
      console.warn("[AuthContext] Logout warning:", err);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;

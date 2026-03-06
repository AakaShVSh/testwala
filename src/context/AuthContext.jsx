/**
 * src/context/AuthContext.jsx
 * ─────────────────────────────────────────────────
 * Global auth state. Replaces ALL sessionStorage.getItem("user") calls.
 *
 * Usage:
 *   import { useAuth } from "../context/AuthContext";
 *   const { user, loading, signIn, signOut } = useAuth();
 *
 * Wrap your app root with <AuthProvider> (done in Main.jsx).
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until first /auth/me resolves

  const refresh = useCallback(async () => {
    try {
      const res = await authAPI.me();
      setUser(res.data ?? res.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  // Restore session on every page load
  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const signIn = async (credentials) => {
    const res = await authAPI.signIn(credentials);
    const u = res.data?.user ?? res.user ?? null;
    setUser(u);
    return u;
  };

  const signOut = async () => {
    try {
      await authAPI.signOut();
    } catch (_) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}

/**
 * src/context/AuthContext.jsx
 *
 * ARCHITECTURE
 * ─────────────────────────────────────────────────────────────────
 * Backend uses httpOnly cookies — no token ever in the response body.
 * auth.js stores the user in sessionStorage and fires "sessionchange".
 *
 * This context:
 *   1. Reads user from sessionStorage on mount
 *   2. Calls /auth/me on mount to restore session after a page refresh
 *   3. Listens to the "sessionchange" event fired by auth.js so that
 *      signIn / signOut / signUp → Navbar updates in the same React paint
 *
 * Components call signIn / signOut from this context (not from auth.js directly)
 * so the React state always stays in sync.
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  signInApi,
  signUpApi,
  signOutApi,
  checkSession,
  getCurrentUser,
} from "../apis/auth"; // ← your existing auth.js file

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Seed from sessionStorage immediately (avoids flicker on refresh)
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(true);

  // ── Sync React state whenever auth.js fires "sessionchange" ──────────────
  // auth.js calls saveUser() / clearUser() which dispatch this event.
  // This is the bridge: sessionStorage change → React re-render → Navbar updates.
  useEffect(() => {
    const onSessionChange = () => {
      setUser(getCurrentUser()); // re-read sessionStorage → triggers re-render
    };
    window.addEventListener("sessionchange", onSessionChange);
    return () => window.removeEventListener("sessionchange", onSessionChange);
  }, []);

  // ── Restore session from cookie on page load ─────────────────────────────
  // If the browser has a valid httpOnly cookie, /auth/me will succeed
  // and auth.js's checkSession() will call saveUser() → fires "sessionchange"
  // → the listener above picks it up → setUser → Navbar updates.
  useEffect(() => {
    checkSession().finally(() => setLoading(false));
  }, []);

  // ── signIn ───────────────────────────────────────────────────────────────
  // Wraps signInApi so components don't import from auth.js directly.
  // signInApi calls saveUser() on success → "sessionchange" fires →
  // listener calls setUser() → Navbar re-renders immediately.
  const signIn = useCallback(async (credentials) => {
    // signInApi(data, setMessage) — we capture message via a local setter
    let message = "";
    const ok = await signInApi(credentials, (msg) => {
      message = msg;
    });
    if (!ok) throw new Error(message || "Sign in failed");
    // user state is already updated via the "sessionchange" listener above
    return getCurrentUser();
  }, []);

  // ── signOut ──────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await signOutApi(); // calls clearUser() → fires "sessionchange" → setUser(null)
  }, []);

  // ── signUp ───────────────────────────────────────────────────────────────
  // signUpApi already calls saveUser() on success (auto sign-in after signup)
  const signUp = useCallback(async (data) => {
    let message = "";
    const ok = await signUpApi(data, null, (msg) => {
      message = msg;
    });
    if (!ok) throw new Error(message || "Registration failed");
    return getCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}

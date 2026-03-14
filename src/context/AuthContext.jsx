/**
 * src/context/AuthContext.jsx
 *
 * FIXES:
 * - joinUserRoom() called on login → socket persists personal notifications
 * - leaveUserRoom() called on logout → clean disconnect
 * - Re-joins room on every auth hydration (page refresh) so socket room
 *   stays in sync even after browser reloads
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
} from "../apis/auth";
import { joinUserRoom, leaveUserRoom } from "../services/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(true);

  // ── Bridge: sessionStorage "sessionchange" event → React state ──────────
  // auth.js calls saveUser() / clearUser() which dispatch this event.
  useEffect(() => {
    const onSessionChange = () => {
      const u = getCurrentUser();
      setUser(u);
      if (u?._id) {
        joinUserRoom(u._id); // ← join personal socket room
      }
    };
    window.addEventListener("sessionchange", onSessionChange);
    return () => window.removeEventListener("sessionchange", onSessionChange);
  }, []);

  // ── Restore session from cookie on page load ─────────────────────────────
  useEffect(() => {
    checkSession()
      .then((u) => {
        if (u?._id) joinUserRoom(u._id); // ← re-join after page refresh
      })
      .finally(() => setLoading(false));
  }, []);

  // ── signIn ────────────────────────────────────────────────────────────────
  const signIn = useCallback(async (credentials) => {
    let message = "";
    const ok = await signInApi(credentials, (msg) => {
      message = msg;
    });
    if (!ok) throw new Error(message || "Sign in failed");
    const u = getCurrentUser();
    if (u?._id) joinUserRoom(u._id); // ← join room immediately
    return u;
  }, []);

  // ── signOut ───────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    const u = getCurrentUser();
    if (u?._id) leaveUserRoom(u._id);
    await signOutApi();
    // signOutApi calls clearUser() → fires "sessionchange" → setUser(null)
  }, []);

  // ── signUp (auto-signs in) ────────────────────────────────────────────────
  const signUp = useCallback(async (data) => {
    let message = "";
    const ok = await signUpApi(data, null, (msg) => {
      message = msg;
    });
    if (!ok) throw new Error(message || "Registration failed");
    const u = getCurrentUser();
    if (u?._id) joinUserRoom(u._id);
    return u;
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

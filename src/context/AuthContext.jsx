// /**
//  * src/context/AuthContext.jsx
//  *
//  * FIXES:
//  * - joinUserRoom() called on login → socket persists personal notifications
//  * - leaveUserRoom() called on logout → clean disconnect
//  * - Re-joins room on every auth hydration (page refresh) so socket room
//  *   stays in sync even after browser reloads
//  */
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from "react";
// import {
//   signInApi,
//   signUpApi,
//   signOutApi,
//   checkSession,
//   getCurrentUser,
// } from "../apis/auth";
// import { joinUserRoom, leaveUserRoom } from "../services/socket";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => getCurrentUser());
//   const [loading, setLoading] = useState(true);

//   // ── Bridge: sessionStorage "sessionchange" event → React state ──────────
//   // auth.js calls saveUser() / clearUser() which dispatch this event.
//   useEffect(() => {
//     const onSessionChange = () => {
//       const u = getCurrentUser();
//       setUser(u);
//       if (u?._id) {
//         joinUserRoom(u._id); // ← join personal socket room
//       }
//     };
//     window.addEventListener("sessionchange", onSessionChange);
//     return () => window.removeEventListener("sessionchange", onSessionChange);
//   }, []);

//   // ── Restore session from cookie on page load ─────────────────────────────
//   useEffect(() => {
//     checkSession()
//       .then((u) => {
//         if (u?._id) joinUserRoom(u._id); // ← re-join after page refresh
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   // ── signIn ────────────────────────────────────────────────────────────────
//   const signIn = useCallback(async (credentials) => {
//     let message = "";
//     const ok = await signInApi(credentials, (msg) => {
//       message = msg;
//     });
//     if (!ok) throw new Error(message || "Sign in failed");
//     const u = getCurrentUser();
//     if (u?._id) joinUserRoom(u._id); // ← join room immediately
//     return u;
//   }, []);

//   // ── signOut ───────────────────────────────────────────────────────────────
//   const signOut = useCallback(async () => {
//     const u = getCurrentUser();
//     if (u?._id) leaveUserRoom(u._id);
//     await signOutApi();
//     // signOutApi calls clearUser() → fires "sessionchange" → setUser(null)
//   }, []);

//   // ── signUp (auto-signs in) ────────────────────────────────────────────────
//   const signUp = useCallback(async (data) => {
//     let message = "";
//     const ok = await signUpApi(data, null, (msg) => {
//       message = msg;
//     });
//     if (!ok) throw new Error(message || "Registration failed");
//     const u = getCurrentUser();
//     if (u?._id) joinUserRoom(u._id);
//     return u;
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
//   return ctx;
// }










/**
 * src/context/AuthContext.jsx
 *
 * Single source of truth for auth state.
 *
 * RULES:
 *  - No localStorage, no sessionStorage, no cookies touched from JS.
 *  - Session lives in the httpOnly _user cookie — backend manages it entirely.
 *  - On every page load we call /auth/me to hydrate the user from the cookie.
 *  - signIn / signUp / signOut call the API directly, then update React state.
 *  - Socket rooms are joined/left automatically on state changes.
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../services/api";
import {
  joinUserRoom,
  leaveUserRoom,
  joinRoleRoom,
  leaveRoleRoom,
} from "../services/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: join all socket rooms for this user
  const joinRooms = useCallback((u) => {
    if (!u?._id) return;
    joinUserRoom(u._id);
    // Role-based rooms used by admin notify/all broadcast
    joinRoleRoom("room:users");
    if (u.isAdmin) joinRoleRoom("room:admin");
    else if (u.coachingId) joinRoleRoom("room:coaching_owners");
    else joinRoleRoom("room:students");
  }, []);

  const leaveRooms = useCallback((u) => {
    if (!u?._id) return;
    leaveUserRoom(u._id);
    leaveRoleRoom("room:users");
    leaveRoleRoom("room:admin");
    leaveRoleRoom("room:coaching_owners");
    leaveRoleRoom("room:students");
  }, []);

  // Hydrate session on every page load via httpOnly cookie
  useEffect(() => {
    authAPI
      .me()
      .then((res) => {
        const u = res.data ?? res;
        setUser(u);
        joinRooms(u);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [joinRooms]);

  const signIn = useCallback(async (credentials) => {
    const res = await authAPI.signIn(credentials);
    const u = res.data ?? res;
    setUser(u);
    joinRooms(u);
    return u;
  }, [joinRooms]);

  const signUp = useCallback(async (data) => {
    const res = await authAPI.signUp(data);
    const u = res.data ?? res;
    setUser(u);
    joinRooms(u);
    return u;
  }, [joinRooms]);

  const signOut = useCallback(async () => {
    leaveRooms(user);
    await authAPI.signOut().catch(() => {});
    setUser(null);
  }, [user, leaveRooms]);

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
// /**
//  * src/services/socket.js
//  * ─────────────────────────────────────────────────────────────────────────────
//  * BEHAVIOUR:
//  *  - "test:attempted" fires on every submission (leaderboard/stats refresh).
//  *  - "coaching:new-request" fires when a coaching registers (admin rooms).
//  *  - "coaching:test-viewed" fires when a coaching owner views a test.
//  *  - "notification:new" fires on the user's personal room when they get a
//  *    notification (test result, broadcast, etc.).
//  *
//  * ROOM DESIGN:
//  *  user:<userId>           → personal notifications for a single user
//  *  coaching:<coachingId>   → events scoped to one coaching org
//  *  room:admin              → admin-only broadcast (new requests, stats)
//  *
//  * RECONNECT STRATEGY:
//  *  All joined rooms are stored in _rooms. On every "connect" event we
//  *  re-emit the join payloads so the server puts us back in the right rooms
//  *  after a network blip — no page refresh needed.
//  * ─────────────────────────────────────────────────────────────────────────────
//  */
// import { io } from "socket.io-client";

// const SOCKET_URL =
//   process.env.REACT_APP_BACKEND_URL || "https://testwala-backend.onrender.com";

// export const socket = io(SOCKET_URL, {
//   autoConnect: true,
//   withCredentials: true,
//   transports: ["websocket", "polling"],
//   reconnection: true,
//   reconnectionAttempts: 10,
//   reconnectionDelay: 1500,
//   reconnectionDelayMax: 5000,
// });

// // ── Room registry ─────────────────────────────────────────────────────────────
// // Maps room-string → emit-event-name so we know how to re-join after reconnect.
// const _rooms = new Map(); // room → emitEvent

// socket.on("connect", () => {
//   console.log("[socket] connected:", socket.id);
//   _rooms.forEach((emitEvent, room) => {
//     socket.emit(emitEvent, room);
//     console.log("[socket] re-joined", room, "via", emitEvent);
//   });
// });

// socket.on("disconnect", (reason) => {
//   console.log("[socket] disconnected:", reason);
// });

// socket.on("connect_error", (e) => {
//   console.warn("[socket] connect_error:", e.message);
// });

// // ── Internal helper ───────────────────────────────────────────────────────────
// function _join(room, emitEvent, leaveEvent) {
//   _rooms.set(room, emitEvent);
//   if (socket.connected) socket.emit(emitEvent, room);
//   // Return a cleanup function for use in useEffect
//   return () => {
//     _rooms.delete(room);
//     if (socket.connected) socket.emit(leaveEvent, room);
//   };
// }

// // ── Public helpers ────────────────────────────────────────────────────────────

// /**
//  * joinUserRoom(userId)
//  * Call once after login. Joins `user:<userId>` for personal notifications.
//  * Returns a cleanup fn — call it on logout or component unmount.
//  */
// export function joinUserRoom(userId) {
//   if (!userId) return () => {};
//   const room = `user:${userId}`;
//   return _join(room, "join-user", "leave-user");
// }

// /**
//  * leaveUserRoom(userId)
//  * Convenience alias — call on logout.
//  */
// export function leaveUserRoom(userId) {
//   if (!userId) return;
//   const room = `user:${userId}`;
//   _rooms.delete(room);
//   if (socket.connected) socket.emit("leave-user", room);
// }

// /**
//  * joinCoachingRoom(coachingId)
//  * Call when mounting a coaching-scoped page.
//  * Returns a cleanup fn for useEffect.
//  */
// export function joinCoachingRoom(coachingId) {
//   if (!coachingId) return () => {};
//   const room = `coaching:${coachingId}`;
//   return _join(room, "join-coaching", "leave-coaching");
// }

// /**
//  * leaveCoachingRoom(coachingId)
//  * Convenience alias — call when leaving a coaching page.
//  */
// export function leaveCoachingRoom(coachingId) {
//   if (!coachingId) return;
//   const room = `coaching:${coachingId}`;
//   _rooms.delete(room);
//   if (socket.connected) socket.emit("leave-coaching", room);
// }

// /**
//  * joinAdminRoom()
//  * Call inside admin-only components. Joins `room:admin` for live
//  * new-coaching-request and dashboard-stats events.
//  * Returns a cleanup fn for useEffect.
//  */
// export function joinAdminRoom() {
//   return _join("room:admin", "join-admin", "leave-admin");
// }

// /**
//  * leaveAdminRoom()
//  * Convenience alias.
//  */
// export function leaveAdminRoom() {
//   _rooms.delete("room:admin");
//   if (socket.connected) socket.emit("leave-admin", "room:admin");
// }











/**
 * src/services/socket.js
 * ─────────────────────────────────────────────────────────────────────────────
 * BEHAVIOUR:
 *  - "test:attempted" fires on every submission (leaderboard/stats refresh).
 *  - "coaching:new-request" fires when a coaching registers (admin rooms).
 *  - "coaching:test-viewed" fires when a coaching owner views a test.
 *  - "notification:new" fires on the user's personal room when they get a
 *    notification (test result, broadcast, etc.).
 *
 * ROOM DESIGN:
 *  user:<userId>           → personal notifications for a single user
 *  coaching:<coachingId>   → events scoped to one coaching org
 *  room:admin              → admin-only broadcast (new requests, stats)
 *
 * RECONNECT STRATEGY:
 *  All joined rooms are stored in _rooms. On every "connect" event we
 *  re-emit the join payloads so the server puts us back in the right rooms
 *  after a network blip — no page refresh needed.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_BACKEND_URL || "https://testwala-backend.onrender.com";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1500,
  reconnectionDelayMax: 5000,
});

// ── Room registry ─────────────────────────────────────────────────────────────
// Maps room-string → emit-event-name so we know how to re-join after reconnect.
const _rooms = new Map(); // room → emitEvent

socket.on("connect", () => {
  console.log("[socket] connected:", socket.id);
  _rooms.forEach((emitEvent, room) => {
    socket.emit(emitEvent, room);
    console.log("[socket] re-joined", room, "via", emitEvent);
  });
});

socket.on("disconnect", (reason) => {
  console.log("[socket] disconnected:", reason);
});

socket.on("connect_error", (e) => {
  console.warn("[socket] connect_error:", e.message);
});

// ── Internal helper ───────────────────────────────────────────────────────────
function _join(room, emitEvent, leaveEvent) {
  _rooms.set(room, emitEvent);
  if (socket.connected) socket.emit(emitEvent, room);
  // Return a cleanup function for use in useEffect
  return () => {
    _rooms.delete(room);
    if (socket.connected) socket.emit(leaveEvent, room);
  };
}

// ── Public helpers ────────────────────────────────────────────────────────────

/**
 * joinUserRoom(userId)
 * Call once after login. Joins `user:<userId>` for personal notifications.
 * Returns a cleanup fn — call it on logout or component unmount.
 */
export function joinUserRoom(userId) {
  if (!userId) return () => {};
  const room = `user:${userId}`;
  return _join(room, "join-user", "leave-user");
}

/**
 * leaveUserRoom(userId)
 * Convenience alias — call on logout.
 */
export function leaveUserRoom(userId) {
  if (!userId) return;
  const room = `user:${userId}`;
  _rooms.delete(room);
  if (socket.connected) socket.emit("leave-user", room);
}

/**
 * joinCoachingRoom(coachingId)
 * Call when mounting a coaching-scoped page.
 * Returns a cleanup fn for useEffect.
 */
export function joinCoachingRoom(coachingId) {
  if (!coachingId) return () => {};
  const room = `coaching:${coachingId}`;
  return _join(room, "join-coaching", "leave-coaching");
}

/**
 * leaveCoachingRoom(coachingId)
 * Convenience alias — call when leaving a coaching page.
 */
export function leaveCoachingRoom(coachingId) {
  if (!coachingId) return;
  const room = `coaching:${coachingId}`;
  _rooms.delete(room);
  if (socket.connected) socket.emit("leave-coaching", room);
}

/**
 * joinAdminRoom()
 * Call inside admin-only components. Joins `room:admin` for live
 * new-coaching-request and dashboard-stats events.
 * Returns a cleanup fn for useEffect.
 */
export function joinAdminRoom() {
  return _join("room:admin", "join-admin", "leave-admin");
}

/**
 * leaveAdminRoom()
 * Convenience alias.
 */
export function leaveAdminRoom() {
  _rooms.delete("room:admin");
  if (socket.connected) socket.emit("leave-admin", "room:admin");
}

/**
 * joinRoleRoom(room)
 * Joins a broadcast room like "room:users", "room:students",
 * "room:coaching_owners", or "room:admin".
 * Called by AuthContext on login so admin notify/all reaches the right clients.
 * Returns a cleanup fn for useEffect.
 */
export function joinRoleRoom(room) {
  if (!room) return () => {};
  return _join(room, "join-room", "leave-room");
}

/**
 * leaveRoleRoom(room)
 * Leave a broadcast room. Called by AuthContext on logout.
 */
export function leaveRoleRoom(room) {
  if (!room) return;
  _rooms.delete(room);
  if (socket.connected) socket.emit("leave-room", room);
}
/**
 * src/services/socket.js
 *
 * FIXES:
 * 1. Rooms are re-joined on every "connect" event (handles reconnections)
 * 2. joinUserRoom / joinCoachingRoom / leaveCoachingRoom helpers exported
 *    so components call a single function instead of raw socket.emit
 * 3. autoConnect: true so the socket actually connects on import
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

// ── Track which rooms this tab wants to stay in ────────────────────────────
// On reconnect we re-join them automatically so no manual refresh is needed.
const _rooms = new Set();

socket.on("connect", () => {
  console.log("[socket] connected:", socket.id);
  // Re-join every tracked room after a reconnect
  _rooms.forEach((room) => {
    const event = room.startsWith("user:") ? "join-user" : "join-coaching";
    socket.emit(event, room);
    console.log("[socket] re-joined", room);
  });
});

socket.on("disconnect", (reason) => {
  console.log("[socket] disconnected:", reason);
});

socket.on("connect_error", (e) => {
  console.log("[socket] connect_error:", e.message);
});

// ── Public helpers ─────────────────────────────────────────────────────────

/**
 * Call once when the user logs in.
 * Joins `user:<userId>` room for personal notifications.
 */
export function joinUserRoom(userId) {
  if (!userId) return;
  const room = `user:${userId}`;
  _rooms.add(room);
  if (socket.connected) socket.emit("join-user", room);
  // If not yet connected, the "connect" listener above will join on connect
}

/**
 * Call when entering a coaching page.
 * Joins `coaching:<coachingId>` room for real-time test updates.
 */
export function joinCoachingRoom(coachingId) {
  if (!coachingId) return;
  const room = `coaching:${coachingId}`;
  _rooms.add(room);
  if (socket.connected) socket.emit("join-coaching", room);
}

/**
 * Call when leaving a coaching page.
 */
export function leaveCoachingRoom(coachingId) {
  if (!coachingId) return;
  const room = `coaching:${coachingId}`;
  _rooms.delete(room);
  if (socket.connected) socket.emit("leave-coaching", room);
}

/**
 * Call when the user logs out.
 */
export function leaveUserRoom(userId) {
  if (!userId) return;
  const room = `user:${userId}`;
  _rooms.delete(room);
  if (socket.connected) socket.emit("leave-user", room);
}

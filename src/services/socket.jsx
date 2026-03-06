import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_BACKEND_URL || "https://testwala-backend.onrender.com";

export const socket = io(SOCKET_URL, {
  autoConnect: true, // ← must be true to actually connect
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

// Debug helpers — remove after testing
socket.on("connect", () => console.log("[socket] connected:", socket.id));
socket.on("disconnect", () => console.log("[socket] disconnected"));
socket.on("connect_error", (e) => console.log("[socket] error:", e.message));

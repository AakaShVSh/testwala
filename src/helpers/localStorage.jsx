// // localStorage.js
// localStorage is intentionally NOT used for persistent data.
// These are lightweight in-memory helpers using sessionStorage
// ONLY for passing transient test-flow state between pages
// (e.g. result data navigated to /test-result).
// All real data is fetched from / saved to the backend.

/**
 * Store a value in sessionStorage for the current browser session only.
 * Cleared automatically when the tab closes.
 */
export const setLocalStorage = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors silently
  }
};

/**
 * Read a value from sessionStorage.
 * Returns null if the key doesn't exist or JSON is malformed.
 */
export const getLocalStorage = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Remove a key from sessionStorage.
 */
export const deleteLocalStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
};
/**
 * src/services/api.js
 * ─────────────────────────────────────────────────
 * SINGLE source of truth for all backend calls.
 * Import from here everywhere — never write apiFetch locally.
 * No localStorage / sessionStorage / cookies needed.
 */

export const BASE = "https://testwala-backend.onrender.com";

export const apiFetch = async (path, opts = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || `Error ${res.status}`);
  return json;
};

// ── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  me: () => apiFetch("/auth/me"),
  signIn: (body) =>
    apiFetch("/auth/signin", { method: "POST", body: JSON.stringify(body) }),
  signUp: (body) =>
    apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  signOut: () => apiFetch("/auth/signout", { method: "POST" }),
  forgotPassword: (email) =>
    apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ Email: email }),
    }),
  changePassword: (uid, pw) =>
    apiFetch(`/auth/change-password/${uid}`, {
      method: "PATCH",
      body: JSON.stringify({ Password: pw }),
    }),
  updateProfile: (body) =>
    apiFetch("/auth/profile", { method: "PATCH", body: JSON.stringify(body) }),
};

// ── Coaching ──────────────────────────────────────────────────────────────
export const coachingAPI = {
  getAll: (p = {}) => apiFetch(`/coaching?${new URLSearchParams(p)}`),
  getMine: () => apiFetch("/coaching/mine"),
  getBySlug: (slug) => apiFetch(`/coaching/${slug}`),
  create: (body) =>
    apiFetch("/coaching/create", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id, b) =>
    apiFetch(`/coaching/${id}`, { method: "PATCH", body: JSON.stringify(b) }),
  delete: (id) => apiFetch(`/coaching/${id}`, { method: "DELETE" }),
};

// ── Tests ─────────────────────────────────────────────────────────────────
export const testsAPI = {
  getAll: (p = {}) => apiFetch(`/tests?${new URLSearchParams(p)}`),
  getById: (id) => apiFetch(`/tests/id/${id}`),
  getBySlug: (slug, pw) =>
    apiFetch(`/tests/${slug}${pw ? `?password=${pw}` : ""}`),
  getByToken: (token) => apiFetch(`/tests/token/${token}`),
  getStats: (id) => apiFetch(`/tests/${id}/stats`),
  getLeaderboard: (id) => apiFetch(`/tests/${id}/leaderboard`),
  create: (body) =>
    apiFetch("/tests/create", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) =>
    apiFetch(`/tests/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (id) => apiFetch(`/tests/${id}`, { method: "DELETE" }),
};

// ── Results ───────────────────────────────────────────────────────────────
export const resultsAPI = {
  submit: (body) =>
    apiFetch("/results/submit", { method: "POST", body: JSON.stringify(body) }),
  getMyResults: () => apiFetch("/results/student/me"),
  getById: (id) => apiFetch(`/results/${id}`),
  getForTest: (testId) => apiFetch(`/results/test/${testId}`),
};

// ── Questions ─────────────────────────────────────────────────────────────
export const questionsAPI = {
  getAll: (p = {}) => apiFetch(`/questions?${new URLSearchParams(p)}`),
  getSubjects: () => apiFetch("/questions/subjects"),
};

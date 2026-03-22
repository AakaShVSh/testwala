// /**
//  * src/services/api.js
//  * ─────────────────────────────────────────────────────────────────────────────
//  * SINGLE source of truth for all backend calls.
//  *
//  * Rules:
//  *  • Import from here everywhere — never write apiFetch locally.
//  *  • No localStorage / sessionStorage / cookies needed (session via httpOnly cookie).
//  *  • testService.jsx is DEPRECATED — all its functions are replaced below.
//  * ─────────────────────────────────────────────────────────────────────────────
//  */

// export const BASE = "http://localhost:8080";
// // export const BASE = "https://testwala-backend.onrender.com";

// /**
//  * Core fetch wrapper.
//  * Automatically includes credentials (session cookie) and JSON headers.
//  * Throws on non-2xx responses using the backend's `message` field.
//  */
// export const apiFetch = async (path, opts = {}) => {
//   const res = await fetch(`${BASE}${path}`, {
//     credentials: "include",
//     headers: { "Content-Type": "application/json", ...opts.headers },
//     ...opts,
//   });
//   const json = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(json.message || `Error ${res.status}`);
//   return json;
// };

// // ── Auth ──────────────────────────────────────────────────────────────────────
// export const authAPI = {
//   /** Fetch the currently logged-in user (also updates lastSeen on the server). */
//   me: () => apiFetch("/auth/me"),

//   signIn: (body) =>
//     apiFetch("/auth/signin", { method: "POST", body: JSON.stringify(body) }),

//   signUp: (body) =>
//     apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(body) }),

//   signOut: () => apiFetch("/auth/signout", { method: "POST" }),

//   forgotPassword: (email) =>
//     apiFetch("/auth/forgot-password", {
//       method: "POST",
//       body: JSON.stringify({ Email: email }),
//     }),

//   changePassword: (uid, pw) =>
//     apiFetch(`/auth/change-password/${uid}`, {
//       method: "PATCH",
//       body: JSON.stringify({ Password: pw }),
//     }),

//   updateProfile: (body) =>
//     apiFetch("/auth/profile", { method: "PATCH", body: JSON.stringify(body) }),

//   /**
//    * Record that the logged-in student viewed a test for the first time.
//    * Call this on mount of TestDetailPage for non-owners.
//    * Server deduplicates — safe to call on every page load.
//    */
//   recordTestView: (testId) =>
//     apiFetch("/auth/record-test-view", {
//       method: "POST",
//       body: JSON.stringify({ testId }),
//     }),
// };

// // ── Coaching ──────────────────────────────────────────────────────────────────
// export const coachingAPI = {
//   getAll: (p = {}) => apiFetch(`/coaching?${new URLSearchParams(p)}`),
//   getMine: () => apiFetch("/coaching/mine"),
//   getBySlug: (slug) => apiFetch(`/coaching/${slug}`),
//   create: (body) =>
//     apiFetch("/coaching/create", {
//       method: "POST",
//       body: JSON.stringify(body),
//     }),
//   update: (id, b) =>
//     apiFetch(`/coaching/${id}`, { method: "PATCH", body: JSON.stringify(b) }),
//   delete: (id) => apiFetch(`/coaching/${id}`, { method: "DELETE" }),

//   /** Admin: fetch students who attempted tests under this coaching. */
//   getStudents: () => apiFetch("/coaching/students"),
// };

// // ── Tests ─────────────────────────────────────────────────────────────────────
// export const testsAPI = {
//   getAll: (p = {}) => apiFetch(`/tests?${new URLSearchParams(p)}`),
//   getById: (id) => apiFetch(`/tests/id/${id}`),
//   getBySlug: (slug, pw) =>
//     apiFetch(`/tests/${slug}${pw ? `?password=${pw}` : ""}`),

//   /** Resolve a private-access token → returns the test data. */
//   getByToken: (token) => apiFetch(`/tests/token/${token}`),

//   /**
//    * Mark that the student actually pressed "Start Test" via a token link.
//    * Call this inside launchTest() when location.state.accessToken is present.
//    */
//   startByToken: (token) =>
//     apiFetch(`/tests/token/${token}/start`, { method: "POST" }),

//   getStats: (id) => apiFetch(`/tests/${id}/stats`),
//   getLeaderboard: (id) => apiFetch(`/tests/${id}/leaderboard`),

//   /**
//    * Get the link-visit analytics for a test (coach/admin only).
//    * Returns: [{ userId, userName, userEmail, visitedAt, daysSinceLastLogin,
//    *             wasLoggedIn, didStart, didSubmit, source }]
//    */
//   getVisits: (id) => apiFetch(`/tests/${id}/visits`),

//   create: (body) =>
//     apiFetch("/tests/create", { method: "POST", body: JSON.stringify(body) }),
//   update: (id, body) =>
//     apiFetch(`/tests/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
//   delete: (id) => apiFetch(`/tests/${id}`, { method: "DELETE" }),
// };

// // ── Results ───────────────────────────────────────────────────────────────────
// export const resultsAPI = {
//   submit: (body) =>
//     apiFetch("/results/submit", { method: "POST", body: JSON.stringify(body) }),

//   /**
//    * Get the logged-in student's own results.
//    * Pass { testId } to filter to a specific test.
//    */
//   getMyResults: (p = {}) => {
//     const qs = new URLSearchParams(p).toString();
//     return apiFetch(`/results/student/me${qs ? `?${qs}` : ""}`);
//   },

//   getById: (id) => apiFetch(`/results/${id}`),
//   getForTest: (testId) => apiFetch(`/results/test/${testId}`),
// };

// // ── Questions ─────────────────────────────────────────────────────────────────
// export const questionsAPI = {
//   getAll: (p = {}) => apiFetch(`/questions?${new URLSearchParams(p)}`),
//   getSubjects: () => apiFetch("/questions/subjects"),
// };

// // ── Notifications ─────────────────────────────────────────────────────────────
// export const notificationsAPI = {
//   /** Get all notifications for the logged-in user. */
//   getAll: () => apiFetch("/notifications"),

//   /** Mark a single notification as read. */
//   markRead: (id) => apiFetch(`/notifications/${id}/read`, { method: "PATCH" }),

//   /** Mark every notification as read in one shot. */
//   markAllRead: () => apiFetch("/notifications/read-all", { method: "PATCH" }),

//   /** Delete a single notification. */
//   delete: (id) => apiFetch(`/notifications/${id}`, { method: "DELETE" }),

//   /** Delete all notifications for the logged-in user. */
//   clearAll: () => apiFetch("/notifications/clear-all", { method: "DELETE" }),
// };

// // ── Admin ─────────────────────────────────────────────────────────────────────
// // All endpoints require isAdmin === true on the session user.
// export const adminAPI = {
//   // ── Dashboard ──────────────────────────────────────────────────────────────
//   /**
//    * Platform-wide stats snapshot.
//    * Returns: { totalUsers, onlineNow, testsToday, totalTests,
//    *            totalResults, coachingCount, pendingCoaching,
//    *            pendingTestRequests, recentActivity[] }
//    */
//   getDashboard: () => apiFetch("/admin/dashboard"),

//   // ── Users ──────────────────────────────────────────────────────────────────
//   /**
//    * Paginated user list with online status and last-seen.
//    * Params: { page, limit, search, role, isOnline }
//    */
//   getUsers: (p = {}) => apiFetch(`/admin/users?${new URLSearchParams(p)}`),

//   /** Full profile for a single user including their test history. */
//   getUserById: (id) => apiFetch(`/admin/users/${id}`),

//   /** Update user fields (name, email, isAdmin, etc.). */
//   updateUser: (id, body) =>
//     apiFetch(`/admin/users/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(body),
//     }),

//   /** Permanently delete a user account. */
//   deleteUser: (id) => apiFetch(`/admin/users/${id}`, { method: "DELETE" }),

//   // ── Coaching management ────────────────────────────────────────────────────
//   /**
//    * Filterable coaching request list.
//    * Params: { status, search }
//    */
//   getCoachingRequests: (p = {}) =>
//     apiFetch(`/admin/coaching/requests?${new URLSearchParams(p)}`),

//   approveCoaching: (id, body = {}) =>
//     apiFetch(`/admin/coaching/${id}/approve`, {
//       method: "PATCH",
//       body: JSON.stringify(body),
//     }),

//   rejectCoaching: (id, body = {}) =>
//     apiFetch(`/admin/coaching/${id}/reject`, {
//       method: "PATCH",
//       body: JSON.stringify(body),
//     }),

//   deleteCoaching: (id) => apiFetch(`/coaching/${id}`, { method: "DELETE" }),

//   // ── Test management ────────────────────────────────────────────────────────
//   /**
//    * All tests on the platform.
//    * Params: { coachingId, examType, visibility, page, limit }
//    */
//   getAllTests: (p = {}) => apiFetch(`/admin/tests?${new URLSearchParams(p)}`),

//   /**
//    * Per-test student analytics — who viewed the link, who started,
//    * who finished, conversion rates.
//    */
//   getTestAnalytics: (testId) => apiFetch(`/admin/tests/${testId}/analytics`),

//   // ── Test Requests ──────────────────────────────────────────────────────────
//   /**
//    * All test-creation requests submitted by coaching owners.
//    * Params: { status, search }
//    */
//   getTestRequests: (p = {}) =>
//     apiFetch(`/test-requests/admin/all?${new URLSearchParams(p)}`),

//   getTestRequestById: (id) => apiFetch(`/test-requests/admin/${id}`),

//   markTestRequestProcessing: (id) =>
//     apiFetch(`/test-requests/admin/${id}/processing`, { method: "PATCH" }),

//   /** Send the completed test back to the coaching. */
//   fulfillTestRequest: (id, body) =>
//     apiFetch(`/test-requests/admin/${id}/create-test`, {
//       method: "POST",
//       body: JSON.stringify(body),
//     }),

//   rejectTestRequest: (id, body) =>
//     apiFetch(`/test-requests/admin/${id}/reject`, {
//       method: "PATCH",
//       body: JSON.stringify(body),
//     }),

//   // ── Subject Registry ───────────────────────────────────────────────────────
//   /**
//    * Admin-managed list of subjects / exam types shown to coaching owners
//    * when they create tests or submit test requests.
//    */
//   getSubjects: () => apiFetch("/admin/subjects"),

//   addSubject: (body) =>
//     apiFetch("/admin/subjects", {
//       method: "POST",
//       body: JSON.stringify(body),
//     }),

//   updateSubject: (id, body) =>
//     apiFetch(`/admin/subjects/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(body),
//     }),

//   deleteSubject: (id) =>
//     apiFetch(`/admin/subjects/${id}`, { method: "DELETE" }),

//   // ── Broadcast Notifications ────────────────────────────────────────────────
//   /**
//    * Send a notification to one user, all coaching owners, or all users.
//    * body: { targetType: "user"|"coaching-owners"|"all",
//    *         targetId?: "<userId>",
//    *         title, message, actionUrl? }
//    */
//   sendNotification: (body) =>
//     apiFetch("/admin/notify", {
//       method: "POST",
//       body: JSON.stringify(body),
//     }),
// };

// // ── Test Requests (Coaching owner side) ───────────────────────────────────────
// export const testRequestsAPI = {
//   /** Coaching owner submits a new test-creation request. */
//   create: (body) =>
//     apiFetch("/test-requests/create", {
//       method: "POST",
//       body: JSON.stringify(body),
//     }),

//   /** All requests submitted by this coaching. */
//   getMine: () => apiFetch("/test-requests/mine"),

//   /** Single request detail. */
//   getById: (id) => apiFetch(`/test-requests/${id}`),
// };









/**
 * src/services/api.js
 * ─────────────────────────────────────────────────────────────────────────────
 * SINGLE source of truth for all backend calls.
 *
 * Rules:
 *  • Import from here everywhere — never write apiFetch locally.
 *  • No localStorage / sessionStorage / cookies needed (session via httpOnly cookie).
 *  • testService.jsx is DEPRECATED — all its functions are replaced below.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// export const BASE = "http://localhost:8080";
export const BASE = "https://testwala-backend.onrender.com";

/**
 * Core fetch wrapper.
 * Automatically includes credentials (session cookie) and JSON headers.
 * Throws on non-2xx responses using the backend's `message` field.
 */
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

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  /** Fetch the currently logged-in user (also updates lastSeen on the server). */
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

  /** Step 2 of forgot-password — call AFTER verifyOtp sets the _reset cookie */
  verifyOtp: (userId, otp) =>
    apiFetch("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ userId, otp }),
    }),

  /** Reads the _reset httpOnly cookie set by verifyOtp — no userId in URL */
  changePassword: (pw) =>
    apiFetch("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify({ Password: pw }),
    }),

  updateProfile: (body) =>
    apiFetch("/auth/profile", { method: "PATCH", body: JSON.stringify(body) }),

  /**
   * Record that the logged-in student viewed a test for the first time.
   * Call this on mount of TestDetailPage for non-owners.
   * Server deduplicates — safe to call on every page load.
   */
  recordTestView: (testId) =>
    apiFetch("/auth/record-test-view", {
      method: "POST",
      body: JSON.stringify({ testId }),
    }),
};

// ── Coaching ──────────────────────────────────────────────────────────────────
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

  /** Admin: fetch students who attempted tests under this coaching. */
  getStudents: () => apiFetch("/coaching/students"),
};

// ── Tests ─────────────────────────────────────────────────────────────────────
export const testsAPI = {
  getAll: (p = {}) => apiFetch(`/tests?${new URLSearchParams(p)}`),
  getById: (id) => apiFetch(`/tests/id/${id}`),
  getBySlug: (slug, pw) =>
    apiFetch(`/tests/${slug}${pw ? `?password=${pw}` : ""}`),

  /** Resolve a private-access token → returns the test data. */
  getByToken: (token) => apiFetch(`/tests/token/${token}`),

  /**
   * Mark that the student actually pressed "Start Test" via a token link.
   * Call this inside launchTest() when location.state.accessToken is present.
   */
  startByToken: (token) =>
    apiFetch(`/tests/token/${token}/start`, { method: "POST" }),

  getStats: (id) => apiFetch(`/tests/${id}/stats`),
  getLeaderboard: (id) => apiFetch(`/tests/${id}/leaderboard`),

  /**
   * Get the link-visit analytics for a test (coach/admin only).
   * Returns: [{ userId, userName, userEmail, visitedAt, daysSinceLastLogin,
   *             wasLoggedIn, didStart, didSubmit, source }]
   */
  getVisits: (id) => apiFetch(`/tests/${id}/visits`),

  create: (body) =>
    apiFetch("/tests/create", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) =>
    apiFetch(`/tests/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (id) => apiFetch(`/tests/${id}`, { method: "DELETE" }),
};

// ── Results ───────────────────────────────────────────────────────────────────
export const resultsAPI = {
  submit: (body) =>
    apiFetch("/results/submit", { method: "POST", body: JSON.stringify(body) }),

  /**
   * Get the logged-in student's own results.
   * Pass { testId } to filter to a specific test.
   */
  getMyResults: (p = {}) => {
    const qs = new URLSearchParams(p).toString();
    return apiFetch(`/results/student/me${qs ? `?${qs}` : ""}`);
  },

  getById: (id) => apiFetch(`/results/${id}`),
  getForTest: (testId) => apiFetch(`/results/test/${testId}`),
};

// ── Questions ─────────────────────────────────────────────────────────────────
export const questionsAPI = {
  getAll: (p = {}) => apiFetch(`/questions?${new URLSearchParams(p)}`),
  getSubjects: () => apiFetch("/questions/subjects"),
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationsAPI = {
  /** Get all notifications for the logged-in user. */
  getAll: () => apiFetch("/notifications/mine"),

  /** Mark a single notification as read. */
  markRead: (id) => apiFetch(`/notifications/${id}/read`, { method: "PATCH" }),

  /** Mark every notification as read in one shot. */
  markAllRead: () => apiFetch("/notifications/read-all", { method: "PATCH" }),

  /** Delete a single notification. */
  delete: (id) => apiFetch(`/notifications/${id}`, { method: "DELETE" }),

  /** Delete all notifications for the logged-in user. */
  clearAll: () => apiFetch("/notifications/clear-all", { method: "DELETE" }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
// All endpoints require isAdmin === true on the session user.
export const adminAPI = {
  // ── Dashboard ──────────────────────────────────────────────────────────────
  /**
   * Platform-wide stats snapshot.
   * Returns: { totalUsers, onlineNow, testsToday, totalTests,
   *            totalResults, coachingCount, pendingCoaching,
   *            pendingTestRequests, recentActivity[] }
   */
  getDashboard: () => apiFetch("/admin/dashboard"),

  // ── Users ──────────────────────────────────────────────────────────────────
  /**
   * Paginated user list with online status and last-seen.
   * Params: { page, limit, search, role, isOnline }
   */
  getUsers: (p = {}) => apiFetch(`/admin/users?${new URLSearchParams(p)}`),

  /** Full profile for a single user including their test history. */
  getUserById: (id) => apiFetch(`/admin/users/${id}`),

  /** Update user fields (name, email, isAdmin, etc.). */
  updateUser: (id, body) =>
    apiFetch(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  /** Permanently delete a user account. */
  deleteUser: (id) => apiFetch(`/admin/users/${id}`, { method: "DELETE" }),

  // ── Coaching management ────────────────────────────────────────────────────
  /**
   * Filterable coaching request list.
   * Params: { status, search }
   */
  getCoachingRequests: (p = {}) =>
    apiFetch(`/admin/coaching/requests?${new URLSearchParams(p)}`),

  approveCoaching: (id, body = {}) =>
    apiFetch(`/admin/coaching/${id}/approve`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  rejectCoaching: (id, body = {}) =>
    apiFetch(`/admin/coaching/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteCoaching: (id) => apiFetch(`/coaching/${id}`, { method: "DELETE" }),

  // ── Test management ────────────────────────────────────────────────────────
  /**
   * All tests on the platform.
   * Params: { coachingId, examType, visibility, page, limit }
   */
  getAllTests: (p = {}) => apiFetch(`/admin/tests?${new URLSearchParams(p)}`),

  /**
   * Per-test student analytics — who viewed the link, who started,
   * who finished, conversion rates.
   */
  getTestAnalytics: (testId) => apiFetch(`/admin/tests/${testId}/analytics`),

  // ── Test Requests ──────────────────────────────────────────────────────────
  /**
   * All test-creation requests submitted by coaching owners.
   * Params: { status, search }
   */
  getTestRequests: (p = {}) =>
    apiFetch(`/test-requests/admin/all?${new URLSearchParams(p)}`),

  getTestRequestById: (id) => apiFetch(`/test-requests/admin/${id}`),

  markTestRequestProcessing: (id) =>
    apiFetch(`/test-requests/admin/${id}/processing`, { method: "PATCH" }),

  /** Send the completed test back to the coaching. */
  fulfillTestRequest: (id, body) =>
    apiFetch(`/test-requests/admin/${id}/create-test`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  rejectTestRequest: (id, body) =>
    apiFetch(`/test-requests/admin/${id}/reject`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  // ── Subject Registry ───────────────────────────────────────────────────────
  /**
   * Admin-managed list of subjects / exam types shown to coaching owners
   * when they create tests or submit test requests.
   */
  getSubjects: () => apiFetch("/admin/subjects"),

  addSubject: (body) =>
    apiFetch("/admin/subjects", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateSubject: (id, body) =>
    apiFetch(`/admin/subjects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  deleteSubject: (id) =>
    apiFetch(`/admin/subjects/${id}`, { method: "DELETE" }),

  // ── Broadcast Notifications ────────────────────────────────────────────────
  /**
   * Send a notification to one user, all coaching owners, or all users.
   * body: { targetType: "user"|"coaching-owners"|"all",
   *         targetId?: "<userId>",
   *         title, message, actionUrl? }
   */
  /**
   * Broadcast to all users or a role subset.
   * body: { title, body, actionUrl?, targetRole: "all"|"coaching_owners"|"students" }
   */
  broadcastNotification: (body) =>
    apiFetch("/admin/notify/all", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /**
   * Send to one specific user.
   * body: { title, body, actionUrl? }
   */
  notifyUser: (userId, body) =>
    apiFetch(`/admin/notify/user/${userId}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ── Test Requests (Coaching owner side) ───────────────────────────────────────
export const testRequestsAPI = {
  /** Coaching owner submits a new test-creation request. */
  create: (body) =>
    apiFetch("/test-requests/create", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** All requests submitted by this coaching. */
  getMine: () => apiFetch("/test-requests/mine"),

  /** Single request detail. */
  getById: (id) => apiFetch(`/test-requests/${id}`),
};
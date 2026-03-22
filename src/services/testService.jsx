/**
 * src/services/testService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️  DEPRECATED — do not add new code here.
 *
 * This file previously used axios + cookies + localStorage for auth.
 * All of that logic has been centralised in api.js which uses the native
 * fetch API with httpOnly session cookies (no manual token storage needed).
 *
 * MIGRATION GUIDE
 * ───────────────
 * Replace every import from this file with the equivalent from api.js:
 *
 *   OLD (testService)                NEW (api)
 *   ─────────────────────────────    ──────────────────────────────────────
 *   signUpApi(data, _, setMsg)   →   authAPI.signUp(data)
 *   signInApi(data, setMsg)      →   authAPI.signIn(data)
 *   createTestApi(data, setMsg)  →   testsAPI.create(data)
 *   getAllTestsApi(setMsg)        →   testsAPI.getAll()
 *   getTestByIdApi(id, setMsg)   →   testsAPI.getById(id)
 *   getTestBySlugApi(s, setMsg)  →   testsAPI.getBySlug(s)
 *   getTestLeaderboardApi(id, _) →   testsAPI.getLeaderboard(id)
 *   updateTestApi(id, d, setMsg) →   testsAPI.update(id, d)
 *   deleteTestApi(id, setMsg)    →   testsAPI.delete(id)
 *
 * The shims below let existing call-sites keep working while you migrate.
 * They log a deprecation warning in development so you can track them down.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { authAPI, testsAPI } from "./api";

const warn = (fn) =>
  console.warn(
    `[testService] "${fn}" is deprecated. Import from services/api.js instead.`,
  );

// ── Auth shims ────────────────────────────────────────────────────────────────

export const signUpApi = async (data, _cmpPassword, setMessage) => {
  warn("signUpApi");
  try {
    const r = await authAPI.signUp(data);
    setMessage?.(r.message);
    return true;
  } catch (e) {
    setMessage?.(e.message || "Something went wrong");
    return false;
  }
};

export const signInApi = async (data, setMessage) => {
  warn("signInApi");
  try {
    const r = await authAPI.signIn(data);
    setMessage?.(r.message);
    return true;
  } catch (e) {
    setMessage?.(e.message || "Something went wrong");
    return false;
  }
};

// ── Test shims ────────────────────────────────────────────────────────────────

export const createTestApi = async (testData, setMessage) => {
  warn("createTestApi");
  try {
    return await testsAPI.create(testData);
  } catch (e) {
    setMessage?.("Failed to save test");
    return null;
  }
};

export const getAllTestsApi = async (setMessage) => {
  warn("getAllTestsApi");
  try {
    const r = await testsAPI.getAll();
    return r.data ?? r;
  } catch (e) {
    setMessage?.("Failed to fetch tests");
    return [];
  }
};

export const getTestByIdApi = async (id, setMessage) => {
  warn("getTestByIdApi");
  try {
    const r = await testsAPI.getById(id);
    return r.data ?? r;
  } catch (e) {
    setMessage?.("Failed to fetch test");
    return null;
  }
};

export const getTestBySlugApi = async (slug, setMessage) => {
  warn("getTestBySlugApi");
  try {
    const r = await testsAPI.getBySlug(slug);
    return r.data ?? r;
  } catch (e) {
    setMessage?.("Failed to fetch test");
    return null;
  }
};

export const getTestLeaderboardApi = async (id, setMessage) => {
  warn("getTestLeaderboardApi");
  try {
    const r = await testsAPI.getLeaderboard(id);
    return r.data ?? r;
  } catch (e) {
    setMessage?.("Failed to fetch leaderboard");
    return [];
  }
};

export const updateTestApi = async (id, updatedData, setMessage) => {
  warn("updateTestApi");
  try {
    return await testsAPI.update(id, updatedData);
  } catch (e) {
    setMessage?.("Failed to update test");
    return null;
  }
};

export const deleteTestApi = async (id, setMessage) => {
  warn("deleteTestApi");
  try {
    return await testsAPI.delete(id);
  } catch (e) {
    setMessage?.("Failed to delete test");
    return null;
  }
};

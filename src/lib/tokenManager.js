/**
 * ============================================================
 *  TOKEN MANAGER (tokenManager.js)
 * ============================================================
 *  Handles all token operations: get, set, remove.
 *  Tokens are stored in localStorage.
 *
 *  HRMS uses:
 *    - accessToken  → stored as 'hrms_token'   → Bearer header
 *    - refreshToken → stored as 'hrms_refresh'  → token rotation
 *
 *  RULE: No file should touch localStorage directly.
 *        Always use these helpers.
 * ============================================================
 */

const TOKEN_KEY         = 'hrms_token';
const REFRESH_TOKEN_KEY = 'hrms_refresh';
const USER_INFO_KEY     = 'hrms_user';

/**
 * Read localStorage safely — returns null for missing/invalid values.
 */
const readClean = (key) => {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(key);
  if (!v || v === 'null' || v === 'undefined') return null;
  return v;
};

// ─── ACCESS TOKEN ────────────────────────────────────────────
/** @returns {string|null} */
export const getToken = () => readClean(TOKEN_KEY);

/** Save token and fire auth_changed event so components re-render */
export const setToken = (token) => {
  if (typeof window === 'undefined' || !token) return;
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event('auth_changed'));
};

/**
 * Rotate token silently (used by refresh interceptor only).
 * Does NOT dispatch auth_changed — prevents /me re-fetch loops.
 */
export const setTokenSilent = (token) => {
  if (typeof window === 'undefined' || !token) return;
  localStorage.setItem(TOKEN_KEY, token);
};

// ─── REFRESH TOKEN ───────────────────────────────────────────
/** @returns {string|null} */
export const getRefreshToken = () => readClean(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token) => {
  if (typeof window === 'undefined' || !token) return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

// ─── USER INFO ───────────────────────────────────────────────
/** @returns {object|null} */
export const getUserInfo = () => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(USER_INFO_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setUserInfo = (userInfo) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  window.dispatchEvent(new Event('auth_changed'));
};

// ─── CLEAR ALL (Logout) ──────────────────────────────────────
/** Remove all auth data — call on logout */
export const clearTokens = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
  window.dispatchEvent(new Event('auth_changed'));
};

// ─── HELPERS ─────────────────────────────────────────────────
/** Returns true if user is logged in (has access token) */
export const isAuthenticated = () => !!getToken();

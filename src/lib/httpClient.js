/**
 * ============================================================
 *  HTTP CLIENT (httpClient.js)
 * ============================================================
 *  Single Axios instance used by the entire HRMS application.
 *  - Base URL comes from .env (NEXT_PUBLIC_API_URL)
 *  - Request interceptor: Attaches Bearer token automatically
 *  - Response interceptor: Handles 401 → refresh token → retry
 *  - Failed refresh → logout user, redirect to /login
 *
 *  RULE: No file should import axios directly.
 *        Always use httpClient or the api* helpers.
 * ============================================================
 */

import axios from 'axios';
import { getToken, getRefreshToken, setTokenSilent, clearTokens } from '@/lib/tokenManager';
import { API_BASE_URL, ENDPOINTS } from '@/constants/endpoints';

// ─── Create Axios Instance ──────────────────────────────────
const httpClient = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
});

// ─── REQUEST INTERCEPTOR ─────────────────────────────────────
// Attach Bearer token to every request automatically
httpClient.interceptors.request.use(
  (config) => {
    // Skip token for refresh endpoint (avoid circular dependency)
    if (!config.url?.includes('/auth/refresh') && !config.skipAuth) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────
// 401 → try refresh token → retry original request
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  // Success → pass through
  (response) => response,

  // Error handling
  async (error) => {
    const originalRequest = error.config;

    // Don't retry the refresh endpoint itself
    if (originalRequest?.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // 401 → try refresh; 403 → redirect to unauthorized
    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Another refresh in progress → queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              httpClient(originalRequest).then(resolve).catch(reject);
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        // Use plain axios (not httpClient) to avoid interceptor loop
        const res = await axios.post(
          `${API_BASE_URL || 'http://localhost:8080/api'}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken }
        );

        const newToken = res.data?.accessToken;
        if (!newToken) throw new Error('Refresh returned no token');

        // Silently rotate — no auth_changed event to prevent /me re-fetch loop
        setTokenSilent(newToken);
        httpClient.defaults.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;

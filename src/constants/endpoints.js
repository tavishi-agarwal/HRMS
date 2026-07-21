/**
 * ENDPOINTS.js
 * ============
 * Saare API URLs ek jagah — poore project mein yahan se import karo.
 * Usage: import { ENDPOINTS, API_BASE_URL } from "@/constants/endpoints"
 *
 * Base URL: .env mein NEXT_PUBLIC_API_URL set karo
 * Example: NEXT_PUBLIC_API_URL=http://localhost:8080/api
 */

// ─── Base URL ────────────────────────────────────────────────
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const ENDPOINTS = {
  AUTH: {
    LOGIN_OTP: "/api/v1/auth/login-otp",
    VERIFY_OTP: "/api/v1/auth/verify-otp",
    ME: "/api/v1/auth/me",
  },

  EMPLOYEES: {
    PROFILE: (userId) => `/api/employees/user/${userId}`,
    CREATE: "/api/employees",
    LIST: "/api/employees",
    UPLOAD_DOCUMENT: (employeeId) =>
      `/api/employees/${employeeId}/documents`,
    DOWNLOAD_DOCUMENT: (documentId) =>
      `/api/employees/documents/${documentId}/download`,
  },

  LEAVE: {
    MY_LEAVES: "/api/v1/leaves",
    MY_BALANCES: "/api/v1/leaves/balances",
    APPLY: "/api/v1/leaves",
    PENDING: "/api/v1/leaves/pending",
    ALL: "/api/v1/leaves/all",
    STATS: "/api/v1/leaves/status/counts",
    APPROVE: (id) => `/api/v1/leaves/${id}/approve`,
    REJECT: (id) => `/api/v1/leaves/${id}/reject`,
  },

  HOLIDAY: {
    ALL: "/api/v1/holidays",
    UPCOMING: "/api/v1/holidays/upcoming",
    CREATE: "/api/v1/holidays",
    UPDATE: (id) => `/api/v1/holidays/${id}`,
    DELETE: (id) => `/api/v1/holidays/${id}`,
  },

  LEAVE_POLICY: {
    ALL: "/api/v1/leave-policies",
    UPDATE: (type) => `/api/v1/leave-policies/${type}`,
  },

  EVENTS: {
    UPCOMING: "/api/v1/events/upcoming",
    CREATE: "/api/v1/events",
    UPDATE: (id) => `/api/v1/events/${id}`,
    DELETE: (id) => `/api/v1/events/${id}`,
  },

  CLAIMS: {
    BASE: "/api/v1/claims",

    // Future-ready endpoints
    DETAILS: (id) => `/api/v1/claims/${id}`,
    UPDATE: (id) => `/api/v1/claims/${id}`,
    DELETE: (id) => `/api/v1/claims/${id}`,
  },
  ATTENDANCE: {
  TODAY: "/api/v1/attendance/today",
  PUNCH_IN: "/api/v1/attendance/punch-in",
  PUNCH_OUT: "/api/v1/attendance/punch-out",
  ANNUAL: "/api/v1/attendance/annual",
  RANGE: "/api/v1/attendance/range",
},
};
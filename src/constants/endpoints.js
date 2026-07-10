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
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const ENDPOINTS = {

  // ─── AUTH ─────────────────────────────────────────
  AUTH: {
    LOGIN:          "/auth/login",
    LOGOUT:         "/auth/logout",
    REFRESH_TOKEN:  "/auth/refresh",
    FORGOT_PASSWORD:"/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_OTP:     "/auth/verify-otp",
    ME:             "/auth/me",           // get logged-in user profile
  },

  // ─── EMPLOYEES ────────────────────────────────────
  EMPLOYEES: {
    LIST:           "/employees",                  // GET  → all employees
    CREATE:         "/employees",                  // POST → create employee
    GET:            (id) => `/employees/${id}`,    // GET  → single employee
    UPDATE:         (id) => `/employees/${id}`,    // PUT  → update employee
    DELETE:         (id) => `/employees/${id}`,    // DELETE
    SEARCH:         "/employees/search",
  },

  // ─── ATTENDANCE ───────────────────────────────────
  ATTENDANCE: {
    LIST:           "/attendance",                 // GET  → my attendance
    TEAM:           "/attendance/team",            // GET  → team attendance (TL/HR)
    PUNCH_IN:       "/attendance/punch-in",        // POST
    PUNCH_OUT:      "/attendance/punch-out",       // POST
    CORRECTIONS:    "/attendance/corrections",     // GET/POST → correction requests
    CORRECTION:     (id) => `/attendance/corrections/${id}`, // GET/PUT
  },

  // ─── LEAVE ────────────────────────────────────────
  LEAVE: {
    LIST:           "/leaves",                     // GET  → my leaves
    APPLY:          "/leaves",                     // POST → apply leave
    GET:            (id) => `/leaves/${id}`,       // GET  → single leave
    CANCEL:         (id) => `/leaves/${id}/cancel`,// PUT
    PENDING:        "/leaves/pending",             // GET  → pending approvals (TL/HR)
    APPROVE:        (id) => `/leaves/${id}/approve`,// PUT
    REJECT:         (id) => `/leaves/${id}/reject`, // PUT
    BALANCE:        "/leaves/balance",             // GET  → leave balance
  },

  // ─── CLAIMS ───────────────────────────────────────
  CLAIMS: {
    LIST:           "/claims",                     // GET  → my claims
    SUBMIT:         "/claims",                     // POST → submit claim
    GET:            (id) => `/claims/${id}`,       // GET  → single claim
    PENDING:        "/claims/pending",             // GET  → pending approvals
    APPROVE:        (id) => `/claims/${id}/approve`,// PUT
    REJECT:         (id) => `/claims/${id}/reject`, // PUT
  },

  // ─── PAYROLL ──────────────────────────────────────
  PAYROLL: {
    PAYSLIPS:       "/payroll/payslips",           // GET  → my payslips
    PAYSLIP:        (id) => `/payroll/payslips/${id}`, // GET single
    DOWNLOAD:       (id) => `/payroll/payslips/${id}/download`,
  },

  // ─── REPORTS ──────────────────────────────────────
  REPORTS: {
    LIST:           "/reports",                    // GET
    GENERATE:       "/reports/generate",           // POST
    DOWNLOAD:       (id) => `/reports/${id}/download`,
  },

  // ─── USERS (Admin) ────────────────────────────────
  USERS: {
    LIST:           "/users",                      // GET
    CREATE:         "/users",                      // POST
    GET:            (id) => `/users/${id}`,
    UPDATE:         (id) => `/users/${id}`,
    DELETE:         (id) => `/users/${id}`,
    CHANGE_ROLE:    (id) => `/users/${id}/role`,
  },

  // ─── AUDIT LOGS (Admin) ───────────────────────────
  AUDIT: {
    LIST:           "/audit-logs",                 // GET
    GET:            (id) => `/audit-logs/${id}`,
  },

  // ─── NOTIFICATIONS ────────────────────────────────
  NOTIFICATIONS: {
    LIST:           "/notifications",              // GET
    MARK_READ:      (id) => `/notifications/${id}/read`, // PUT
    MARK_ALL_READ:  "/notifications/mark-all-read",// PUT
    UNREAD_COUNT:   "/notifications/unread-count", // GET
  },

  // ─── PROFILE ──────────────────────────────────────
  PROFILE: {
    GET:            "/profile",                    // GET
    UPDATE:         "/profile",                    // PUT
    CHANGE_PASSWORD:"/profile/change-password",   // PUT
    UPLOAD_AVATAR:  "/profile/avatar",             // POST (multipart)
  },

};

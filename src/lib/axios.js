import axios from "axios";

/**
 * axios.js — Configured Axios Instance
 * =====================================
 * Ye ek configured axios instance hai jo:
 * 1. Base URL automatically lagate hai (.env se)
 * 2. Har request mein Bearer token automatically add karta hai
 * 3. 401 error pe automatic logout karta hai
 *
 * Usage: NEVER import axios directly. Use this instance.
 * import axiosInstance from "@/lib/axios"
 */

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  timeout: 15000, // 15 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── REQUEST INTERCEPTOR ──────────────────────────────────────
// Har request se pehle token automatically add hoga
axiosInstance.interceptors.request.use(
  (config) => {
    // Token localStorage se read karo
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("hrms_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────
// Response aane pe ya error pe kya karna hai
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // 401 = Unauthorized → token expire ho gaya → logout
    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hrms_token");
        window.location.href = "/login";
      }
    }

    // 403 = Forbidden → permission nahi
    if (status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/unauthorized";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

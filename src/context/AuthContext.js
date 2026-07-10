"use client";

import { createContext, useContext, useState } from "react";
import { ROLES } from "@/constants/roles";

// Export context so useAuth hook can import it directly
export const AuthContext = createContext(null);

/**
 * AuthProvider — Wrap your app with this
 * ========================================
 * Already added in src/app/layout.js
 *
 * Provides: { user, setUser }
 * user shape: { id, name, email, role }
 */
export function AuthProvider({ children }) {
  // Mock user — replace with real API call (authService.getMe()) after login
  const [user, setUser] = useState({
    id: 1,
    name: "Abhishek Sharma",
    email: "abhisheksharma@reviewadda.com",
    role: ROLES.EMPLOYEE, // Change to ROLES.HR / ROLES.ADMIN to test other dashboards
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — shortcut hook (also available from @/hooks/useAuth)
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
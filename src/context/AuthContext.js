"use client";
import { createContext, useContext, useState } from "react";
import { ROLES } from "@/constants/roles";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  // Mock user (replace with API later)
  const [user, setUser] = useState({
    id: 1,
    name: "John Doe",
    role: ROLES.EMPLOYEE, // Change this to test different roles
  });
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

/**
 * useAuth — Auth context shortcut hook
 * ======================================
 * Usage anywhere in a client component:
 *   import { useAuth } from "@/hooks/useAuth"
 *   const { user, setUser } = useAuth()
 *
 * Returns: { user, setUser }
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}

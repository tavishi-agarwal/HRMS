"use client";

import { useRouter } from "next/navigation";

/**
 * RoleGuard - wraps content that requires specific roles
 * @param {string[]} allowedRoles - array of roles that can see this content
 * @param {React.ReactNode} children
 * @param {React.ReactNode} fallback - shown if role not allowed (optional)
 */
export default function RoleGuard({ allowedRoles = [], children, fallback = null }) {
  const router = useRouter();

  // TODO: replace with real user from AuthContext
  const user = { role: "EMPLOYEE" };

  if (!allowedRoles.includes(user.role)) {
    return fallback;
  }

  return children;
}

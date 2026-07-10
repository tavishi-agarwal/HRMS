import { useAuth } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/constants/permissions";

/**
 * usePermissions — Permission check hook
 * ========================================
 * Usage in any client component:
 *   import { usePermissions } from "@/hooks/usePermissions"
 *   const { can } = usePermissions()
 *
 *   if (can("manage_employees")) {
 *     return <AddEmployeeButton />
 *   }
 *
 * Or use in JSX:
 *   {can("approve_leave") && <ApproveButton />}
 */
export function usePermissions() {
  const { user } = useAuth();

  const userPermissions = PERMISSIONS[user?.role] || [];

  /**
   * Check if current user has a specific permission
   * @param {string} permission - permission key from permissions.js
   * @returns {boolean}
   */
  const can = (permission) => {
    return userPermissions.includes(permission);
  };

  /**
   * Check if current user has ANY of the given permissions
   * @param {string[]} permissions
   * @returns {boolean}
   */
  const canAny = (permissions) => {
    return permissions.some((p) => userPermissions.includes(p));
  };

  /**
   * Check if current user has ALL of the given permissions
   * @param {string[]} permissions
   * @returns {boolean}
   */
  const canAll = (permissions) => {
    return permissions.every((p) => userPermissions.includes(p));
  };

  return { can, canAny, canAll, permissions: userPermissions };
}

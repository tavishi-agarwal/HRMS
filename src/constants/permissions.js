import { ROLES } from "./roles";

/**
 * permissions.js — Role ke hisaab se kya allow hai
 * ==================================================
 * Usage with usePermissions hook:
 *   const { can } = usePermissions()
 *   if (can("manage_employees")) { ... }
 */

export const PERMISSIONS = {
  [ROLES.EMPLOYEE]: [
    "view_dashboard",
    "view_own_attendance",
    "apply_leave",
    "view_own_leaves",
    "submit_claim",
    "view_own_claims",
    "view_own_payslip",
    "edit_own_profile",
  ],

  [ROLES.TEAM_LEAD]: [
    "view_dashboard",
    "view_own_attendance",
    "view_team_attendance",
    "apply_leave",
    "view_own_leaves",
    "approve_leave",         // Team members ki leave approve kar sakte hain
    "submit_claim",
    "view_own_claims",
    "approve_claim",         // Team members ki claim approve kar sakte hain
    "view_own_payslip",
    "view_reports",
    "edit_own_profile",
  ],

  [ROLES.HR]: [
    "view_dashboard",
    "manage_employees",      // Add/edit/view all employees
    "view_all_attendance",
    "apply_leave",
    "view_all_leaves",
    "approve_leave",
    "submit_claim",
    "view_all_claims",
    "approve_claim",
    "view_all_payslips",
    "view_reports",
    "generate_reports",
    "edit_own_profile",
  ],

  [ROLES.ADMIN]: [
    "view_dashboard",
    "manage_employees",
    "manage_users",          // Create/delete user accounts
    "view_all_attendance",
    "view_all_leaves",
    "approve_leave",
    "view_all_claims",
    "approve_claim",
    "view_all_payslips",
    "view_reports",
    "generate_reports",
    "view_audit_logs",
    "manage_settings",
    "edit_own_profile",
  ],
};

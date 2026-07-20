import { ROLES } from "./roles";

export const NAVIGATION = {
  [ROLES.EMPLOYEE]: [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Attendance", href: "/attendance", icon: "calendar_today" },
    { name: "Leave", href: "/leave", icon: "event_busy" },
    { name: "Claims", href: "/claims", icon: "assignment_late" },
    { name: "Payroll", href: "/payroll", icon: "payments" },
    { name: "Events", href: "/events", icon: "event" },
  ],

  [ROLES.TEAM_LEAD]: [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Profile", href: "/profile", icon: "person" },
    { name: "Team Attendance", href: "/attendance/team", icon: "groups" },
    { name: "Leave", href: "/leave", icon: "event_busy" },
    {
      name: "Leave Management",
      href: "/leave-management",
      icon: "admin_panel_settings",
    },
    {
      name: "Claim Approvals",
      href: "/claims/approvals",
      icon: "task",
    },
    { name: "Reports", href: "/reports", icon: "bar_chart" },
    { name: "Events", href: "/events", icon: "event" },
  ],

  [ROLES.HR]: [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Employees", href: "/employees", icon: "badge" },
    { name: "Attendance", href: "/attendance", icon: "calendar_today" },
    { name: "Leave", href: "/leave", icon: "event_busy" },
    {
      name: "Leave Management",
      href: "/leave-management",
      icon: "admin_panel_settings",
    },
    { name: "Claims", href: "/claims", icon: "assignment_late" },
    { name: "Payroll", href: "/payroll", icon: "payments" },
    { name: "Reports", href: "/reports", icon: "bar_chart" },
    { name: "Events", href: "/events", icon: "event" },
  ],

  [ROLES.ADMIN]: [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    { name: "Users", href: "/users", icon: "group" },
    { name: "Leave", href: "/leave", icon: "event_busy" },
    {
      name: "Leave Management",
      href: "/leave-management",
      icon: "admin_panel_settings",
    },
    { name: "Audit Logs", href: "/audit-logs", icon: "security" },
    { name: "Reports", href: "/reports", icon: "bar_chart" },
    { name: "Settings", href: "/settings", icon: "settings" },
    { name: "Events", href: "/events", icon: "event" },
  ],
};
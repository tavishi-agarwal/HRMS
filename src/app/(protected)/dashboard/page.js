"use client";

import EmployeeDashboard from "@/modules/dashboard/EmployeeDashboard";
import HRDashboard from "@/modules/dashboard/HRDashboard";
import TeamLeadDashboard from "@/modules/dashboard/TeamLeadDashboard";
import AdminDashboard from "@/modules/dashboard/AdminDashboard";

export default function DashboardPage() {
  // temporary role until login API is connected
  const user = { role: "EMPLOYEE" };

  if (user.role === "HR") return <HRDashboard />;
  if (user.role === "TEAM_LEAD") return <TeamLeadDashboard />;
  if (user.role === "ADMIN") return <AdminDashboard />;

  return <EmployeeDashboard />;
}

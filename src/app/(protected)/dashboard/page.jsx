"use client";

import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import HRDashboard from "@/components/dashboard/HRDashboard";
import TeamLeadDashboard from "@/components/dashboard/TeamLeadDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function DashboardPage() {
  // temporary role until login API is connected
  const user = { role: "EMPLOYEE" }; 

  if (user.role === "HR") return <HRDashboard />;
  if (user.role === "TEAM_LEAD") return <TeamLeadDashboard />;
  if (user.role === "ADMIN") return <AdminDashboard />;

  return <EmployeeDashboard />;
}
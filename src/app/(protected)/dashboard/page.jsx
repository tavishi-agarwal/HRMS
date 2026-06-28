"use client";

import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/constants/roles";

import EmployeeDashboard from "@/components/dashboard/EmployeeDashboard";
import HRDashboard from "@/components/dashboard/HRDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TeamLeadDashboard from "@/components/dashboard/TeamLeadDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  switch (user.role) {
    case ROLES.EMPLOYEE:
      return <EmployeeDashboard />;

    case ROLES.TEAM_LEAD:
      return <TeamLeadDashboard />;

    case ROLES.HR:
      return <HRDashboard />;

    case ROLES.ADMIN:
      return <AdminDashboard />;

    default:
      return <h1>Unauthorized</h1>;
  }
}
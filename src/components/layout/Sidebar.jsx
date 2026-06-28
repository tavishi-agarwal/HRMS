"use client";

import Link from "next/link";
import { NAVIGATION } from "@/constants/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const menuItems = NAVIGATION[user.role] || [];

  return (
    <aside className="w-64 bg-slate-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">HRMS</h2>

      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:text-blue-300 transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
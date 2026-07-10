"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/constants/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // Temporary user until backend auth is connected
  const user = {
    name: "Abhishek Sharma",
    email: "abhisheksharma@reviewadda.com",
    role: "EMPLOYEE",
  };

  const navItems = NAVIGATION[user.role] || [];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-slate-100 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
          <span className="material-symbols-rounded">grid_view</span>
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-indigo-900 leading-none">HRMS</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">
            HR MANAGEMENT
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <p className="px-4 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Main
        </p>

        <div className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  active
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                }`}
              >
                <span className="material-symbols-rounded text-[20px] shrink-0">
                  {item.icon}
                </span>

                <span className="text-sm font-semibold whitespace-nowrap">
                  {item.name || item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-4 pb-12">
        <div className="mt-10 border-t border-slate-100 pt-6 space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[20px]">settings</span>
            <span className="text-sm font-medium">Settings</span>
          </Link>

          <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-50">
            <span className="material-symbols-rounded text-[20px]">help</span>
            <span className="text-sm font-medium">Support</span>
          </button>
        </div>

        {/* User Card */}
        <div className="mt-4 p-3 bg-indigo-50 rounded-xl flex items-center gap-3 border border-indigo-100">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0">
            {user.name.charAt(0)}
          </div>

          <div className="overflow-hidden">
            <p className="text-sm font-bold text-indigo-900 truncate">{user.name}</p>
            <p className="text-[10px] text-indigo-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

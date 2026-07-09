"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/constants/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // temporary role until login API is connected
  const user = {
    name: "Abhishek Sharma",
    email: "abhisheksharma@reviewadda.com",
    role: "EMPLOYEE",
  };

  const navItems = NAVIGATION[user.role] || NAVIGATION.EMPLOYEE;

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-white border-r border-slate-100 flex flex-col z-50">
      <div className="px-6 py-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
          <span className="material-symbols-rounded">grid_view</span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-indigo-900 leading-none">
            HRMS
          </h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">
            HR MANAGEMENT
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 text-[10px] font-bold text-slate-400 tracking-widest mb-2 mt-4 uppercase">
          Main
        </p>

        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-rounded">{item.icon}</span>
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-6">
        <div className="mt-4 p-3 bg-indigo-50 rounded-xl flex items-center gap-3 border border-indigo-100">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            A
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-indigo-900 truncate">
              {user.name}
            </p>
            <p className="text-[10px] text-indigo-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
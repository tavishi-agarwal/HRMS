"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION } from "@/constants/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = NAVIGATION[user?.role] || [];

  function isActive(href) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-slate-100 bg-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <span className="material-symbols-rounded text-[22px]">
            grid_view
          </span>
        </div>

        <div>
          <h1 className="text-xl font-extrabold leading-none text-indigo-900">
            HRMS
          </h1>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            HR Management
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Main
        </p>

        <div className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                }`}
              >
                <span className="material-symbols-rounded shrink-0 text-[20px]">
                  {item.icon}
                </span>

                <span className="truncate whitespace-nowrap text-sm font-semibold">
                  {item.name || item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto px-4 pb-6">
        <div className="border-t border-slate-100 pt-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-slate-500 transition-all hover:bg-slate-50 hover:text-indigo-600"
          >
            <span className="material-symbols-rounded shrink-0 text-[20px]">
              help
            </span>

            <span className="text-sm font-medium">Support</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/attendance": "Attendance",
  "/leave": "Leave",
  "/claims": "Claims",
  "/payroll": "Payroll",
  "/reports": "Reports",
  "/employees": "Employees",
  "/notifications": "Notifications",
  "/settings": "Settings",
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const currentUser = user || {
    name: "Abhishek Sharma",
    role: "EMPLOYEE",
  };

  const pageTitle = PAGE_TITLES[pathname] || "HRMS";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-100 bg-white/95 px-5 backdrop-blur sm:px-6 lg:px-8">
      <div className="relative w-full max-w-[360px]">
        <span className="material-symbols-rounded pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-slate-400">
          search
        </span>

        <input
          type="search"
          placeholder={`Search in ${pageTitle}...`}
          className="w-full rounded-full border-0 bg-[#f6f4f7] py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="ml-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/leave/apply")}
          className="hidden rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 md:block"
        >
          Apply for Leave
        </button>

        <button
          type="button"
          onClick={() => router.push("/claims/submit")}
          className="hidden rounded-full bg-fuchsia-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-fuchsia-800 hover:shadow-lg hover:shadow-fuchsia-100 md:block"
        >
          Create Claim
        </button>

        <div className="mx-1 hidden h-6 w-px bg-slate-200 md:block" />

        <button
          type="button"
          onClick={() => router.push("/notifications")}
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
        >
          <span className="material-symbols-rounded text-[21px]">
            notifications
          </span>

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-xs font-black text-slate-900">
            {currentUser.name}
          </p>

          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
            {currentUser.role?.replaceAll("_", " ")}
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-50 bg-indigo-600 text-xs font-black text-white"
          aria-label="Open profile"
        >
          {currentUser.name?.charAt(0) || "U"}
        </button>
      </div>
    </header>
  );
}
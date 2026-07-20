"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const currentUser = user || {
    name: "Abhishek Sharma",
    email: "employee@hrms.com",
    role: "EMPLOYEE",
  };

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleLogout() {
    setProfileMenuOpen(false);

    if (typeof logout === "function") {
      logout();
    }

    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-50 bg-white/80 px-8 py-4 backdrop-blur-md">
      {/* Search */}
      <div className="relative w-96">
        <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          search
        </span>

        <input
          className="w-full rounded-full border-none bg-slate-100 py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          placeholder="Search anything..."
          type="search"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative rounded-full bg-slate-100 p-2.5 text-slate-600 transition-colors hover:bg-slate-200"
        >
          <span className="material-symbols-rounded">notifications</span>

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </Link>

        <Link
          href="/leave/apply"
          className="rounded-full bg-rose-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600"
        >
          Apply for Leave
        </Link>

        <Link
          href="/claims/submit"
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
        >
          Create Claim
        </Link>

        <div className="h-7 w-px bg-slate-200" />

        {/* Profile dropdown */}
        <div ref={profileMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileMenuOpen((open) => !open)}
            className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-slate-50"
            aria-haspopup="menu"
            aria-expanded={profileMenuOpen}
          >
            <div className="hidden text-right xl:block">
              <p className="text-xs font-black text-slate-900">
                {currentUser.name}
              </p>

              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                {currentUser.role?.replaceAll("_", " ")}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-50 bg-indigo-600 text-xs font-black text-white">
              {currentUser.name?.charAt(0) || "U"}
            </div>

            <span
              className={`material-symbols-rounded hidden text-[18px] text-slate-400 transition-transform xl:block ${
                profileMenuOpen ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </button>

          {profileMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/60"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-black text-white">
                  {currentUser.name?.charAt(0) || "U"}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-slate-900">
                    {currentUser.name}
                  </p>

                  <p className="mt-0.5 truncate text-[10px] text-slate-400">
                    {currentUser.email || "employee@hrms.com"}
                  </p>
                </div>
              </div>

              <div className="py-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    router.push("/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <span className="material-symbols-rounded text-[19px]">
                    person
                  </span>
                  My Profile
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <span className="material-symbols-rounded text-[19px]">
                    settings
                  </span>
                  Settings
                </button>
              </div>

              <div className="border-t border-slate-100 pt-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                >
                  <span className="material-symbols-rounded text-[19px]">
                    logout
                  </span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
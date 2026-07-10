"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

import AttendanceCard from "./widgets/AttendanceCard";
import CalendarCard from "./widgets/CalendarCard";
import EventCard from "./widgets/EventCard";
import StatusTracker from "./widgets/StatusTracker";
import ActivityFeed from "./widgets/ActivityFeed";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState("overview");

  const firstName = user?.name?.split(" ")[0] || "Abhi";

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Welcome back, {firstName}! 👋
          </h1>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Here&apos;s what&apos;s happening with your employee dashboard today.
          </p>
        </div>

        <div className="flex w-fit rounded-xl border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setActiveView("overview")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              activeView === "overview"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveView("performance")}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              activeView === "performance"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Performance
          </button>
        </div>
      </section>

      {activeView === "overview" ? (
        <>
          <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <AttendanceCard />
            </div>

            <div className="flex flex-col gap-5">
              <CalendarCard />
              <EventCard />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-8 pb-10 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <StatusTracker />
            </div>

            <ActivityFeed />
          </section>
        </>
      ) : (
        <section className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <span className="material-symbols-rounded">monitoring</span>
          </div>

          <h2 className="mt-4 text-lg font-black text-slate-900">
            Performance preview
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            Performance analytics will appear here after the review and backend
            modules are connected.
          </p>
        </section>
      )}
    </div>
  );
}
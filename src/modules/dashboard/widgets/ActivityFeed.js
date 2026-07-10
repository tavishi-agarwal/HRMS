"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const initialActivities = [
  {
    id: 1,
    title: "Salary Credit",
    message: "Your salary for October has been credited to your bank.",
    time: "2 hours ago",
    icon: "payments",
    style: "bg-emerald-50 text-emerald-600",
  },
  {
    id: 2,
    title: "Leave Approved",
    message: "Your annual leave request has been approved.",
    time: "Yesterday",
    icon: "event_available",
    style: "bg-blue-50 text-blue-600",
  },
  {
    id: 3,
    title: "Company Policy Update",
    message: "The Work-from-Anywhere policy is now available.",
    time: "Oct 22",
    icon: "campaign",
    style: "bg-fuchsia-50 text-fuchsia-600",
  },
];

export default function ActivityFeed() {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState(null);

  return (
    <>
      <section className="flex h-full flex-col justify-between rounded-3xl border border-indigo-50/60 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <span className="material-symbols-rounded text-[21px]">
                  notifications_active
                </span>
              </div>

              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-800">
                  Activity
                </h2>

                <span className="rounded-md bg-rose-500 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white">
                  {initialActivities.length} New
                </span>
              </div>
            </div>
          </div>

          <div className="relative space-y-6">
            {initialActivities.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedActivity(item)}
                className="relative flex w-full items-start gap-4 text-left"
              >
                {index < initialActivities.length - 1 && (
                  <span className="absolute bottom-[-24px] left-5 top-10 w-[2px] bg-slate-100" />
                )}

                <div
                  className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.style}`}
                >
                  <span className="material-symbols-rounded text-[18px]">
                    {item.icon}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                    {item.message}
                  </p>

                  <p className="mt-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                    {item.time}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/notifications")}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-indigo-50/50 hover:text-indigo-600"
        >
          View All Activity
        </button>
      </section>

      {selectedActivity && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
          onClick={() => setSelectedActivity(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${selectedActivity.style}`}
              >
                <span className="material-symbols-rounded">
                  {selectedActivity.icon}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <h2 className="mt-5 text-lg font-black text-slate-900">
              {selectedActivity.title}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {selectedActivity.message}
            </p>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {selectedActivity.time}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
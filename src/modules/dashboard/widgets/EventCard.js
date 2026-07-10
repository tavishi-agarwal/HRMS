"use client";

import { useState } from "react";

export default function EventCard() {
  const [isGoing, setIsGoing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <section className="flex min-h-[112px] items-center gap-4 rounded-3xl border border-pink-100 bg-[#fff2f8] p-4 sm:p-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-pink-100 text-pink-500">
          <span className="material-symbols-rounded text-[28px]">groups</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="rounded bg-pink-100 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-pink-600">
              Office Events
            </span>

            <span className="shrink-0 text-[9px] font-bold text-slate-400">
              3d ago
            </span>
          </div>

          <h3 className="truncate text-xs font-bold text-slate-800">
            Annual Town Hall 2026
          </h3>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIsGoing((current) => !current)}
              className={`rounded-full px-3.5 py-1 text-[9px] font-bold text-white transition ${
                isGoing
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {isGoing ? "Going! ✓" : "RSVP Now"}
            </button>

            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="rounded-full border border-pink-200 bg-white px-3 py-1 text-[9px] font-bold text-pink-500 transition hover:bg-pink-50"
            >
              Details
            </button>
          </div>
        </div>
      </section>

      {showDetails && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-pink-500">
                  Office Event
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Annual Town Hall 2026
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-indigo-600">
                  calendar_month
                </span>
                <p className="text-sm text-slate-600">
                  18 January 2026
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-indigo-600">
                  schedule
                </span>
                <p className="text-sm text-slate-600">3:00 PM</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-rounded text-indigo-600">
                  location_on
                </span>
                <p className="text-sm text-slate-600">
                  Main Auditorium
                </p>
              </div>

              <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-500">
                Join the annual leadership update, employee recognition
                ceremony, product roadmap presentation, and networking session.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsGoing(true);
                setShowDetails(false);
              }}
              className="mt-6 w-full rounded-xl bg-pink-500 py-3 text-sm font-bold text-white transition hover:bg-pink-600"
            >
              {isGoing ? "You are attending ✓" : "Confirm RSVP"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
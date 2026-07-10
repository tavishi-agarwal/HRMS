"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AttendanceCard() {
  const router = useRouter();

  const [punchedIn, setPunchedIn] = useState(true);
  const [punchInTime, setPunchInTime] = useState("09:00 AM");
  const [punchOutTime, setPunchOutTime] = useState("-- : --");
  const [hoursToday, setHoursToday] = useState("08:12");
  const [message, setMessage] = useState("");

  function formatTime(date) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function showMessage(text) {
    setMessage(text);

    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  function handlePunchToggle() {
    const currentTime = formatTime(new Date());

    if (punchedIn) {
      setPunchedIn(false);
      setPunchOutTime(currentTime);
      setHoursToday("08:12");
      showMessage(`Successfully punched out at ${currentTime}.`);
    } else {
      setPunchedIn(true);
      setPunchInTime(currentTime);
      setPunchOutTime("-- : --");
      setHoursToday("00:00");
      showMessage(`Successfully punched in at ${currentTime}.`);
    }
  }

  return (
    <section className="relative flex min-h-[360px] flex-col rounded-3xl border border-indigo-50/60 bg-white p-6 shadow-sm sm:p-8">
      {message && (
        <div className="absolute right-6 top-6 z-10 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-[11px] font-semibold text-emerald-700 shadow-sm">
          {message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <span className="material-symbols-rounded text-[21px]">
              schedule
            </span>
          </div>

          <div>
            <h2 className="text-sm font-black text-slate-800">Attendance</h2>

            <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
              Today&apos;s work session
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/attendance")}
          className="text-xs font-black text-indigo-600 hover:underline"
        >
          View Log
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-6">
        <p className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
          {hoursToday}
        </p>

        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Hrs logged today
        </p>

        <button
          type="button"
          onClick={handlePunchToggle}
          className={`mt-6 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-[0.98] ${
            punchedIn
              ? "bg-rose-500 shadow-rose-100 hover:bg-rose-600"
              : "bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700"
          }`}
        >
          {punchedIn ? "Punch Out Now" : "Punch In Now"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-indigo-100/30 bg-indigo-50/50 p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Punch In
          </p>

          <p className="mt-1 text-base font-black text-slate-800">
            {punchInTime}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Punch Out
          </p>

          <p className="mt-1 text-base font-black text-slate-700">
            {punchOutTime}
          </p>
        </div>
      </div>
    </section>
  );
}
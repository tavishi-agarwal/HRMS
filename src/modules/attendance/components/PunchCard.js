"use client";

import { useEffect, useState } from "react";

export default function PunchCard({
  punchedIn,
  setPunchedIn,
  punchInTime,
  setPunchInTime,
  punchOutTime,
  setPunchOutTime,
  todayHours,
  setTodayHours,
  setAttendance,
  setTimeline,
  showToast,
}) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    function updateClock() {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    }

    updateClock();

    const timer = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(timer);
  }, []);

  function getCurrentShortTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handlePunchToggle() {
    const time = getCurrentShortTime();

    if (punchedIn) {
      setPunchedIn(false);
      setPunchOutTime(time);
      setTodayHours("08:12");

      setAttendance((previous) =>
        previous.map((record) =>
          record.status === "today"
            ? {
                ...record,
                status: "present",
                outTime: time,
                liveHours: "08h 12m",
              }
            : record
        )
      );

      setTimeline((previous) => [
        {
          id: Date.now(),
          title: "Punched Out",
          description: `${time} • Noida Office`,
          type: "error",
        },
        ...previous.filter(
          (item) => item.title !== "Currently Active"
        ),
      ]);

      showToast(
        `Successfully clocked out at ${time}.`,
        "success"
      );

      return;
    }

    setPunchedIn(true);
    setPunchInTime(time);
    setPunchOutTime("-- : --");
    setTodayHours("00:00");

    setAttendance((previous) =>
      previous.map((record) =>
        record.id === "oct-5"
          ? {
              ...record,
              status: "today",
              inTime: time,
              outTime: null,
            }
          : record
      )
    );

    setTimeline([
      {
        id: Date.now(),
        title: "Punched In",
        description: `${time} • Noida Office`,
        type: "success",
      },
      {
        id: Date.now() + 1,
        title: "Currently Active",
        description: "Live tracking session",
        type: "warning",
      },
    ]);

    showToast(
      "Successfully clocked in. Have a productive day.",
      "success"
    );
  }

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
        Current Time
      </p>

      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
        {currentTime || "--:--:--"}
      </h2>

      <p className="mt-1 text-[10px] font-extrabold text-slate-400">
        {currentDate || "Loading date..."}
      </p>

      <div className="mt-5 rounded-2xl bg-indigo-50/50 px-4 py-3">
        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
          Today&apos;s Hours
        </p>

        <p className="mt-1 text-xl font-black text-indigo-600">
          {todayHours}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-indigo-50/50 p-4 text-left">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Punch In
          </p>

          <p className="mt-1 text-sm font-black text-slate-800">
            {punchInTime}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 text-left">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Punch Out
          </p>

          <p className="mt-1 text-sm font-black text-slate-800">
            {punchOutTime}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePunchToggle}
        className={`mt-6 w-full rounded-xl py-3 text-xs font-bold text-white shadow-md transition active:scale-[0.98] ${
          punchedIn
            ? "bg-rose-500 shadow-rose-100 hover:bg-rose-600"
            : "bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700"
        }`}
      >
        {punchedIn ? "Punch Out Now" : "Punch In Now"}
      </button>
    </section>
  );
}
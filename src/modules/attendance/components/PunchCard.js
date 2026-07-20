"use client";

import { useEffect, useState } from "react";

function formatElapsed(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function formatTime(timestamp) {
  if (!timestamp) return "-- : --";

  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PunchCard({
  punchedIn,
  setPunchedIn,
  punchInTimestamp,
  setPunchInTimestamp,
  punchOutTimestamp,
  setPunchOutTimestamp,
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

      if (punchedIn && punchInTimestamp) {
        setTodayHours(formatElapsed(Date.now() - punchInTimestamp));
      }
    }

    updateClock();

    const timer = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(timer);
  }, [punchedIn, punchInTimestamp, setTodayHours]);

  function handlePunchToggle() {
    const now = Date.now();

    if (!punchedIn) {
      setPunchedIn(true);
      setPunchInTimestamp(now);
      setPunchOutTimestamp(null);
      setTodayHours("00:00:00");

      setAttendance((records) =>
        records.map((record) =>
          record.status === "today"
            ? {
                ...record,
                inTime: formatTime(now),
                outTime: null,
              }
            : record
        )
      );

      setTimeline([
        {
          id: now,
          title: "Punched In",
          description: `${formatTime(now)} • Noida Office`,
          type: "success",
        },
        {
          id: now + 1,
          title: "Currently Active",
          description: "Live tracking session",
          type: "warning",
        },
      ]);

      showToast("Successfully clocked in.", "success");
      return;
    }

    setPunchedIn(false);
    setPunchOutTimestamp(now);

    const finalElapsed = punchInTimestamp
      ? formatElapsed(now - punchInTimestamp)
      : "00:00:00";

    setTodayHours(finalElapsed);

    setAttendance((records) =>
      records.map((record) =>
        record.status === "today"
          ? {
              ...record,
              status: "present",
              outTime: formatTime(now),
            }
          : record
      )
    );

    setTimeline((items) => [
      {
        id: now,
        title: "Punched Out",
        description: `${formatTime(now)} • Noida Office`,
        type: "error",
      },
      ...items.filter((item) => item.title !== "Currently Active"),
    ]);

    showToast("Successfully clocked out.", "success");
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
          <p className="text-[9px] font-bold uppercase text-slate-400">
            Punch In
          </p>

          <p className="mt-1 text-sm font-black text-slate-800">
            {formatTime(punchInTimestamp)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4 text-left">
          <p className="text-[9px] font-bold uppercase text-slate-400">
            Punch Out
          </p>

          <p className="mt-1 text-sm font-black text-slate-800">
            {formatTime(punchOutTimestamp)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePunchToggle}
        className={`mt-6 w-full rounded-xl py-3 text-xs font-bold text-white shadow-md ${
          punchedIn
            ? "bg-rose-500 hover:bg-rose-600"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {punchedIn ? "Punch Out Now" : "Punch In Now"}
      </button>
    </section>
  );
}
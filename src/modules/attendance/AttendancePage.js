"use client";

import { useMemo, useState } from "react";

import AttendanceSummary from "./components/AttendanceSummary";
import AttendanceCalendar from "./components/AttendanceCalendar";
import PunchCard from "./components/PunchCard";
import AttendanceTimeline from "./components/AttendanceTimeline";

import {
  INITIAL_ATTENDANCE,
  INITIAL_TIMELINE,
} from "./attendance.data";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);

  const [punchedIn, setPunchedIn] = useState(false);
  const [punchInTimestamp, setPunchInTimestamp] = useState(null);
  const [punchOutTimestamp, setPunchOutTimestamp] = useState(null);
  const [todayHours, setTodayHours] = useState("00:00:00");

  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  const summary = useMemo(() => {
    const records = attendance.filter(
      (record) =>
        !record.isPrevMonth &&
        !record.isNextMonth &&
        record.status !== "future"
    );

    return {
      workingDays: records.filter(
        (record) => !["weekend", "empty"].includes(record.status)
      ).length,
      present: records.filter(
        (record) =>
          record.status === "present" || record.status === "today"
      ).length,
      late: records.filter((record) => record.status === "late").length,
      absent: records.filter((record) => record.status === "absent").length,
    };
  }, [attendance]);

  return (
    <div className="space-y-8">
      {toast && (
        <div
          className={`fixed right-6 top-20 z-[100] rounded-xl border px-5 py-3 text-xs font-semibold shadow-lg ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : toast.type === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : toast.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-indigo-200 bg-indigo-50 text-indigo-800"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Attendance Management
        </h1>

        <p className="mt-1 text-xs font-medium text-slate-500">
          Review live check-in statistics, monthly records, and time tracking.
        </p>
      </div>

      <AttendanceSummary summary={summary} />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AttendanceCalendar
            attendance={attendance}
            showToast={showToast}
          />
        </div>

        <div className="space-y-8">
          <PunchCard
            punchedIn={punchedIn}
            setPunchedIn={setPunchedIn}
            punchInTimestamp={punchInTimestamp}
            setPunchInTimestamp={setPunchInTimestamp}
            punchOutTimestamp={punchOutTimestamp}
            setPunchOutTimestamp={setPunchOutTimestamp}
            todayHours={todayHours}
            setTodayHours={setTodayHours}
            setAttendance={setAttendance}
            setTimeline={setTimeline}
            showToast={showToast}
          />

          <AttendanceTimeline
            timeline={timeline}
            todayHours={todayHours}
          />
        </div>
      </div>
    </div>
  );
}
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

  const [punchedIn, setPunchedIn] = useState(true);
  const [punchInTime, setPunchInTime] = useState("09:00 AM");
  const [punchOutTime, setPunchOutTime] = useState("-- : --");
  const [todayHours, setTodayHours] = useState("08:12");

  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  const summary = useMemo(() => {
    const currentMonthRecords = attendance.filter(
      (record) => !record.isPrevMonth && !record.isNextMonth
    );

    const present = currentMonthRecords.filter(
      (record) =>
        record.status === "present" || record.status === "today"
    ).length;

    const late = currentMonthRecords.filter(
      (record) => record.status === "late"
    ).length;

    const absent = currentMonthRecords.filter(
      (record) => record.status === "absent"
    ).length;

    return {
      workingDays: 22,
      present,
      late,
      absent,
    };
  }, [attendance]);

  return (
    <div className="space-y-8">
      {toast && (
        <div
          className={`fixed right-6 top-20 z-[100] flex items-center gap-3 rounded-xl border px-5 py-3 shadow-lg ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : toast.type === "warning"
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : toast.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-indigo-200 bg-indigo-50 text-indigo-800"
          }`}
        >
          <span className="material-symbols-rounded text-[20px]">
            {toast.type === "success"
              ? "check_circle"
              : toast.type === "warning"
              ? "warning"
              : toast.type === "error"
              ? "error"
              : "info"}
          </span>

          <p className="text-xs font-semibold">{toast.message}</p>
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
            punchInTime={punchInTime}
            showToast={showToast}
          />
        </div>

        <div className="space-y-8">
          <PunchCard
            punchedIn={punchedIn}
            setPunchedIn={setPunchedIn}
            punchInTime={punchInTime}
            setPunchInTime={setPunchInTime}
            punchOutTime={punchOutTime}
            setPunchOutTime={setPunchOutTime}
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
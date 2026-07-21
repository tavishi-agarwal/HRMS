"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import attendanceService from "@/services/attendance.service";

function formatTime(value) {
  if (!value) return null;

  const [hourString, minuteString = "00"] = value.split(":");
  const hour = Number(hourString);

  if (Number.isNaN(hour)) return null;

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return {
    time: `${String(displayHour).padStart(2, "0")}:${minuteString}`,
    period,
  };
}

function formatTotalHours(value) {
  if (value === null || value === undefined) {
    return "00:00";
  }

  const totalHours = Number(value);

  if (Number.isNaN(totalHours)) {
    return "00:00";
  }

  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);

  const adjustedHours = hours + Math.floor(minutes / 60);
  const adjustedMinutes = minutes % 60;

  return `${String(adjustedHours).padStart(2, "0")}:${String(
    adjustedMinutes
  ).padStart(2, "0")}`;
}

function extractData(response) {
  return response?.data ?? response ?? null;
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unable to load attendance."
  );
}

export default function AttendanceCard() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadAttendance() {
    try {
      setLoading(true);
      setError("");

      const response = await attendanceService.getTodayAttendance();
      setAttendance(extractData(response));
    } catch (err) {
      setAttendance(null);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  async function handlePunchIn() {
    try {
      setActionLoading(true);
      setError("");

      const response = await attendanceService.punchIn();
      setAttendance(extractData(response));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePunchOut() {
    try {
      setActionLoading(true);
      setError("");

      const response = await attendanceService.punchOut();
      setAttendance(extractData(response));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }

  const punchIn = formatTime(attendance?.punchInTime);
  const punchOut = formatTime(attendance?.punchOutTime);

  const hasPunchedIn = Boolean(attendance?.punchInTime);
  const hasPunchedOut = Boolean(attendance?.punchOutTime);

  return (
    <div className="flex min-h-[350px] flex-col justify-between rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <span className="material-symbols-rounded">timer</span>
          </div>

          <h3 className="font-bold text-slate-700">Attendance</h3>
        </div>

        <Link
          className="text-xs font-bold text-indigo-600 hover:underline"
          href="/attendance"
        >
          View Log
        </Link>
      </div>

      <div className="py-6 text-center">
        {loading ? (
          <>
            <div className="mx-auto h-14 w-36 animate-pulse rounded-xl bg-slate-100" />
            <p className="mt-3 text-xs font-bold tracking-widest text-slate-400">
              LOADING
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl font-extrabold tracking-tight text-slate-800">
              {formatTotalHours(attendance?.totalHours)}
            </div>

            <p className="mt-2 text-xs font-bold tracking-widest text-slate-400">
              HRS TODAY
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Punch In
          </p>

          {punchIn ? (
            <p className="mt-1 text-xl font-extrabold text-slate-800">
              {punchIn.time}
              <span className="ml-1 text-sm font-bold uppercase text-slate-400">
                {punchIn.period}
              </span>
            </p>
          ) : (
            <p className="mt-1 text-xl font-extrabold text-slate-300">
              -- : --
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Punch Out
          </p>

          {punchOut ? (
            <p className="mt-1 text-xl font-extrabold text-slate-800">
              {punchOut.time}
              <span className="ml-1 text-sm font-bold uppercase text-slate-400">
                {punchOut.period}
              </span>
            </p>
          ) : (
            <p className="mt-1 text-xl font-extrabold text-slate-300">
              -- : --
            </p>
          )}
        </div>
      </div>

      {!loading && !hasPunchedOut && (
        <button
          type="button"
          disabled={actionLoading}
          onClick={hasPunchedIn ? handlePunchOut : handlePunchIn}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="material-symbols-rounded text-lg">
            {hasPunchedIn ? "logout" : "login"}
          </span>

          {actionLoading
            ? "Please wait..."
            : hasPunchedIn
              ? "Punch Out"
              : "Punch In"}
        </button>
      )}

      {!loading && hasPunchedOut && (
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          <span className="material-symbols-rounded text-lg">task_alt</span>
          Attendance completed for today
        </div>
      )}
    </div>
  );
}
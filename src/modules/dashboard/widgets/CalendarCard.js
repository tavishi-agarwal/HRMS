"use client";

import { useEffect, useState } from "react";
import holidayService from "@/services/holiday.service";

function extractData(response) {
  return response?.data ?? response ?? [];
}

function formatDate(value) {
  if (!value) return "";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

export default function CalendarCard() {
  const [now, setNow] = useState(new Date());
  const [holiday, setHoliday] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);

    async function loadUpcomingHoliday() {
      try {
        setLoading(true);

        const response = await holidayService.getUpcomingHolidays();
        const data = extractData(response);

        if (Array.isArray(data)) {
          setHoliday(data.length > 0 ? data[0] : null);
        } else {
          setHoliday(data || null);
        }
      } catch (error) {
        console.error("Failed to load upcoming holiday:", error);
        setHoliday(null);
      } finally {
        setLoading(false);
      }
    }

    loadUpcomingHoliday();

    return () => {
      clearInterval(timer);
    };
  }, []);

  const day = now.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const date = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  const isSingleDayHoliday =
    holiday?.startDate &&
    (!holiday?.endDate || holiday.startDate === holiday.endDate);

  return (
    <div className="relative h-[210px] overflow-hidden rounded-2xl bg-indigo-600 px-6 py-5 text-white shadow-xl shadow-indigo-100">
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">
            Current Date
          </p>

          <h3 className="mt-1 text-2xl font-extrabold leading-tight">
            {day},
            <br />
            {date}
          </h3>
        </div>

        <span className="material-symbols-rounded text-4xl text-indigo-300/50">
          calendar_month
        </span>
      </div>

      <div className="relative z-10 mt-4 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
        <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-200">
          Upcoming Holiday
        </p>

        {loading ? (
          <div className="mt-2 space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-white/20" />
            <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
          </div>
        ) : holiday ? (
          <>
            <p className="mt-0.5 text-sm font-bold">
              {holiday.name}
            </p>

            <p className="text-[10px] text-indigo-100/80">
              {formatDate(holiday.startDate)}

              {!isSingleDayHoliday && holiday.endDate
                ? ` - ${formatDate(holiday.endDate)}`
                : ""}
            </p>
          </>
        ) : (
          <>
            <p className="mt-0.5 text-sm font-bold">
              No upcoming holidays
            </p>

            <p className="text-[10px] text-indigo-100/80">
              No holiday has been scheduled.
            </p>
          </>
        )}
      </div>

      <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-white/5" />
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import eventService from "@/services/event.service";

function extractData(response) {
  return response?.data ?? response ?? [];
}

function formatEventDate(value) {
  if (!value) return "Date not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not available";
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatEventTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getEventDay(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
  });
}

function getEventMonth(value) {
  if (!value) return "EVENT";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "EVENT";
  }

  return date
    .toLocaleDateString("en-US", {
      month: "short",
    })
    .toUpperCase();
}

export default function EventCard() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function loadUpcomingEvent() {
      try {
        setLoading(true);

        const response = await eventService.getUpcomingEvents();
        const data = extractData(response);

        if (Array.isArray(data)) {
          setEvent(data.length > 0 ? data[0] : null);
        } else {
          setEvent(data || null);
        }
      } catch (error) {
        console.error("Failed to load upcoming event:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    loadUpcomingEvent();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="h-20 w-24 animate-pulse rounded-xl bg-slate-100" />

        <div className="flex-1 space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
          <div className="h-7 w-28 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex h-20 w-24 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <span className="material-symbols-rounded text-3xl">
            event_busy
          </span>
        </div>

        <div className="flex-1">
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-500">
            Office Events
          </span>

          <h4 className="mt-2 text-sm font-extrabold text-slate-800">
            No upcoming events
          </h4>

          <p className="mt-1 text-xs text-slate-400">
            No office event has been scheduled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex h-20 w-24 flex-col items-center justify-center rounded-xl bg-rose-100 text-rose-500">
          <span className="text-2xl font-extrabold leading-none">
            {getEventDay(event.eventDate)}
          </span>

          <span className="mt-1 text-[10px] font-extrabold tracking-wider">
            {getEventMonth(event.eventDate)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <span className="max-w-[150px] truncate rounded bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold uppercase text-rose-600">
              {event.eventType || "Office Event"}
            </span>

            <span className="shrink-0 text-[10px] font-bold text-slate-400">
              {formatEventDate(event.eventDate)}
            </span>
          </div>

          <h4 className="mt-1 truncate text-sm font-extrabold text-slate-800">
            {event.name}
          </h4>

          <p className="mt-1 text-[10px] font-semibold text-slate-400">
            {formatEventTime(event.eventDate)}
          </p>

          <div className="mt-3 flex gap-2">
           

            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-bold text-slate-600 transition hover:bg-slate-200"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(eventObject) => eventObject.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded bg-rose-50 px-2 py-1 text-[10px] font-extrabold uppercase text-rose-600">
                  {event.eventType || "Office Event"}
                </span>

                <h3 className="mt-3 text-xl font-extrabold text-slate-800">
                  {event.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Close event details"
              >
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <span className="material-symbols-rounded text-rose-500">
                calendar_month
              </span>

              <div>
                <p className="text-sm font-bold text-slate-700">
                  {formatEventDate(event.eventDate)}
                </p>

                <p className="text-xs text-slate-400">
                  {formatEventTime(event.eventDate)}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {event.description || "No description is available."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDetails(false)}
              className="mt-6 w-full rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-900"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
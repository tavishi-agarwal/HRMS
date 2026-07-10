"use client";

import { useEffect, useState } from "react";

export default function CalendarCard() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());

    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const day = now
    ? now.toLocaleDateString("en-US", {
        weekday: "long",
      })
    : "Loading";

  const date = now
    ? now.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <section className="relative min-h-[180px] overflow-hidden rounded-3xl bg-indigo-600 p-6 text-white shadow-md shadow-indigo-100">
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-200">
            Current Date
          </p>

          <h2 className="mt-1 text-xl font-black leading-tight">
            {day},
            <br />
            {date}
          </h2>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/40">
          <span className="material-symbols-rounded text-[21px]">
            calendar_month
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-5 rounded-2xl border border-indigo-400/20 bg-indigo-500/40 px-4 py-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-indigo-100">
          Upcoming Holiday
        </p>

        <p className="mt-0.5 text-xs font-extrabold">Diwali Festival</p>

        <p className="mt-0.5 text-[9px] font-medium text-indigo-200">
          Nov 12 – Nov 15
        </p>
      </div>

      <div className="absolute -bottom-14 -right-14 h-40 w-40 rounded-full bg-white/5" />
    </section>
  );
}
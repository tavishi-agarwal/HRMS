"use client";

import { useEffect, useState } from "react";

export default function CalendarCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", { day: "numeric", month: "short" });

  return (
    <div className="h-[210px] bg-indigo-600 rounded-2xl px-6 py-5 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">
            Current Date
          </p>

          <h3 className="text-2xl leading-tight font-extrabold mt-1">
            {day},<br />
            {date}
          </h3>
        </div>

        <span className="material-symbols-rounded text-indigo-300/50 text-4xl">
          calendar_month
        </span>
      </div>

      <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10 relative z-10">
        <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">
          Upcoming Holiday
        </p>
        <p className="text-sm font-bold mt-0.5">Diwali Festival</p>
        <p className="text-[10px] text-indigo-100/80">Nov 12 – Nov 15</p>
      </div>

      <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-white/5 rounded-full" />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function CalendarCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const day = now.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const date = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">
            Current Date
          </p>

          <h3 className="text-3xl font-extrabold mt-2">
            {day},
            <br />
            {date}
          </h3>
        </div>

        <span className="material-symbols-rounded text-indigo-300/50 text-6xl">
          calendar_month
        </span>
      </div>

      <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 relative z-10">
        <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">
          Upcoming Holiday
        </p>

        <p className="text-lg font-bold mt-1">Diwali Festival</p>

        <p className="text-xs text-indigo-100/80">
          Nov 12 - Nov 15
        </p>
      </div>

      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
    </div>
  );
}
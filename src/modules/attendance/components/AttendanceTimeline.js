const typeColors = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-rose-500",
  info: "bg-indigo-500",
};

export default function AttendanceTimeline({
  timeline,
  todayHours,
}) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
          Today&apos;s Timeline
        </h2>

        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[9px] font-black text-indigo-600">
          {todayHours} HRS
        </span>
      </div>

      <div className="mt-5 space-y-5">
        {timeline.map((item, index) => (
          <div key={item.id} className="relative flex gap-3">
            {index < timeline.length - 1 && (
              <span className="absolute bottom-[-20px] left-[3px] top-3 w-px bg-slate-100" />
            )}

            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                typeColors[item.type] || "bg-indigo-500"
              }`}
            />

            <div>
              <p className="text-xs font-bold text-slate-700">
                {item.title}
              </p>

              <p className="mt-1 text-[9px] font-semibold text-slate-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {timeline.length === 0 && (
        <div className="py-6 text-center">
          <p className="text-xs font-semibold text-slate-400">
            No attendance activity recorded today.
          </p>
        </div>
      )}
    </section>
  );
}
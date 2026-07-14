const cards = [
  {
    key: "workingDays",
    label: "Total Working Days",
    caption: "This month",
    icon: "calendar_month",
    border: "border-indigo-500",
    iconStyle: "bg-indigo-50 text-indigo-600",
  },
  {
    key: "present",
    label: "Present",
    caption: "Attendance recorded",
    icon: "check_circle",
    border: "border-emerald-500",
    iconStyle: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "late",
    label: "Late Arrivals",
    caption: "Average 12m delay",
    icon: "schedule",
    border: "border-amber-400",
    iconStyle: "bg-amber-50 text-amber-500",
  },
  {
    key: "absent",
    label: "Absences",
    caption: "Unplanned",
    icon: "cancel",
    border: "border-rose-500",
    iconStyle: "bg-rose-50 text-rose-500",
  },
];

export default function AttendanceSummary({ summary }) {
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.key}
          className={`flex items-start justify-between rounded-2xl border-l-4 bg-white p-5 shadow-sm ${card.border}`}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {card.label}
            </p>

            <h2 className="mt-1 text-3xl font-black text-slate-900">
              {summary[card.key]}
            </h2>

            <p className="mt-1 text-[10px] font-extrabold text-slate-400">
              {card.caption}
            </p>
          </div>

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconStyle}`}
          >
            <span className="material-symbols-rounded text-[21px]">
              {card.icon}
            </span>
          </div>
        </article>
      ))}
    </section>
  );
}
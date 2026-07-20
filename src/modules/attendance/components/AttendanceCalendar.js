"use client";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AttendanceCalendar({
  attendance,
  punchInTime,
  showToast,
}) {
  function handleDayClick(record) {
    if (
      record.isPrevMonth ||
      record.isNextMonth ||
      record.status === "future"
    ) {
      return;
    }

    if (record.status === "present") {
      showToast(
        `Oct ${record.dayNumber}: Present. Check-in at ${
          record.inTime || "09:00 AM"
        }.`,
        "info"
      );
      return;
    }

    if (record.status === "today") {
      showToast(
        record.inTime
          ? `Today: Active session started at ${record.inTime}.`
          : "Today: You have not punched in yet.",
        "info"
      );
      return;
    }

    if (record.status === "late") {
      showToast(
        `Oct ${record.dayNumber}: Late arrival at ${record.inTime}.`,
        "warning"
      );
      return;
    }

    if (record.status === "absent") {
      showToast(`Oct ${record.dayNumber}: Marked absent.`, "error");
      return;
    }

    if (record.status === "weekend") {
      showToast(`Oct ${record.dayNumber}: Weekend.`, "info");
    }
  }

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-800">
            Monthly Calendar
          </h2>

          <p className="mt-0.5 text-xs font-semibold text-slate-400">
            October 2023
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              showToast("Previous month preview is not loaded yet.", "info")
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[18px]">
              chevron_left
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              showToast("Next month preview is not loaded yet.", "info")
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <span className="material-symbols-rounded text-[18px]">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="mb-3 text-center text-[9px] font-black uppercase tracking-widest text-slate-400"
          >
            {day}
          </div>
        ))}

        {attendance.map((record) => {
          const outsideMonth =
            record.isPrevMonth || record.isNextMonth;

          const isFuture = record.status === "future";

          return (
            <button
              key={record.id}
              type="button"
              disabled={outsideMonth}
              onClick={() => handleDayClick(record)}
              className={`relative min-h-[74px] border border-slate-100 p-2 text-left transition ${
                outsideMonth
                  ? "cursor-default bg-slate-50/30 text-slate-300"
                  : isFuture
                  ? "cursor-default bg-white"
                  : "cursor-pointer bg-white hover:border-indigo-200 hover:bg-indigo-50/20"
              } ${
                record.status === "today"
                  ? "z-10 rounded-xl bg-indigo-600 text-white shadow-md ring-4 ring-white hover:bg-indigo-600"
                  : ""
              } ${
                record.status === "absent" ? "bg-rose-50/40" : ""
              } ${
                record.status === "weekend" ? "bg-slate-50/50" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`text-[10px] font-bold ${
                    record.status === "today"
                      ? "text-white"
                      : outsideMonth
                      ? "text-slate-300"
                      : "text-slate-800"
                  }`}
                >
                  {String(record.dayNumber).padStart(2, "0")}
                </span>

                {record.status === "present" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}

                {record.status === "late" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                )}

                {record.status === "absent" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                )}
              </div>

              {record.status === "today" && (
                <div className="mt-2">
                  <span className="rounded border border-indigo-400 bg-indigo-500 px-1 py-0.5 text-[7px] font-bold uppercase">
                    Today
                  </span>

                  <p className="mt-1 text-[8px] text-indigo-100">
                    {record.inTime
                      ? `In: ${record.inTime}`
                      : "Not punched in"}
                  </p>
                </div>
              )}

              {record.inTime &&
                record.status !== "today" &&
                record.status !== "future" && (
                  <p className="mt-3 text-[8px] font-semibold text-slate-400">
                    In: {record.inTime}
                  </p>
                )}

              {record.status === "weekend" && (
                <span className="absolute bottom-1 right-1 rounded bg-white px-1 text-[7px] font-bold text-slate-400">
                  WE
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-5 border-t border-slate-100 pt-5">
        <Legend color="bg-emerald-500" label="Present" />
        <Legend color="bg-amber-500" label="Late" />
        <Legend color="bg-rose-500" label="Absent" />
        <Legend color="bg-indigo-600" label="Today" />
      </div>
    </section>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${color}`} />

      <span className="text-[10px] font-semibold text-slate-500">
        {label}
      </span>
    </div>
  );
}
const activities = [
  {
    title: "Salary Credit",
    message: "Your salary for October has been credited to your bank.",
    time: "2 Hours ago",
    color: "emerald",
  },
  {
    title: "Leave Approved",
    message: "Your annual leave request (Nov 15-20) has been approved.",
    time: "Yesterday",
    color: "indigo",
  },
  {
    title: "Company Policy Update",
    message: "New Work-from-Anywhere policy is now live in the document hub.",
    time: "Oct 22",
    color: "fuchsia",
  },
];

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-slate-700">Activity</h3>
        <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
          3 New
        </span>
      </div>

      <div className="flex-1 space-y-6">
        {activities.map((item) => (
          <div key={item.title} className="flex gap-4">
            <div
              className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${
                item.color === "emerald"
                  ? "bg-emerald-50 text-emerald-600"
                  : item.color === "indigo"
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-fuchsia-50 text-fuchsia-600"
              }`}
            >
              ●
            </div>

            <div>
              <p className="text-sm font-bold text-slate-700">{item.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">{item.message}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-8 py-3 border border-slate-100 rounded-xl text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors">
        View All Activity
      </button>
    </div>
  );
}
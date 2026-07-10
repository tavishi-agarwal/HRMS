export default function TeamLeadDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">Team Lead Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor your team&apos;s attendance, leaves and performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Team Members", value: "14", icon: "group", color: "indigo" },
          { label: "Present Today", value: "11", icon: "how_to_reg", color: "emerald" },
          { label: "On Leave", value: "3", icon: "beach_access", color: "amber" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
              <span className="material-symbols-rounded">{stat.icon}</span>
            </div>
            <p className="text-3xl font-extrabold text-slate-800">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

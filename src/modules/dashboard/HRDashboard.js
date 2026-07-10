export default function HRDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">HR Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Manage employees, leaves, payroll and more.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Employees", value: "248", icon: "groups", color: "indigo" },
          { label: "Pending Leaves", value: "12", icon: "event_busy", color: "rose" },
          { label: "Pending Claims", value: "7", icon: "receipt_long", color: "amber" },
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

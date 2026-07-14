export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">Admin Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">System overview and administration panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: "312", icon: "manage_accounts", color: "indigo" },
          { label: "Active Sessions", value: "89", icon: "wifi", color: "emerald" },
          { label: "Audit Logs Today", value: "1,204", icon: "history", color: "amber" },
          { label: "System Alerts", value: "3", icon: "warning", color: "rose" },
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

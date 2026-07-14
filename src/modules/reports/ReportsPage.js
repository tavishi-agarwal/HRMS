// Reports - will connect to backend API
export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">Reports</h2>
        <p className="text-sm text-slate-500 mt-1">Generate and download HR reports</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <span className="material-symbols-rounded text-slate-300 text-5xl">bar_chart</span>
        <p className="text-slate-500 mt-3 font-medium">Reports data will load here from API</p>
      </div>
    </div>
  );
}

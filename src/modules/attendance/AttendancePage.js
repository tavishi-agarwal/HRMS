// AttendancePage - main attendance module
export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">Attendance</h2>
        <p className="text-sm text-slate-500 mt-1">View and manage attendance records</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <span className="material-symbols-rounded text-slate-300 text-5xl">timer</span>
        <p className="text-slate-500 mt-3 font-medium">Attendance data will load here from API</p>
      </div>
    </div>
  );
}

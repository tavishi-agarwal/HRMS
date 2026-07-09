export default function AttendanceCard() {
  return (
    <div className="col-span-12 lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[350px]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <span className="material-symbols-rounded">timer</span>
          </div>
          <h3 className="font-bold text-slate-700">Attendance</h3>
        </div>

        <a className="text-xs font-bold text-indigo-600 hover:underline" href="#">
          View Log
        </a>
      </div>

      <div className="text-center py-6">
        <div className="text-6xl font-extrabold text-slate-800 tracking-tight">
          08:12
        </div>
        <p className="text-slate-400 text-xs font-bold tracking-widest mt-2">
          HRS TODAY
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-5 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Punch In
          </p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">
            09:00{" "}
            <span className="text-slate-400 text-sm font-bold uppercase ml-1">
              AM
            </span>
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Punch Out
          </p>
          <p className="text-xl font-extrabold text-slate-300 mt-1">-- : --</p>
        </div>
      </div>
    </div>
  );
}
// EmployeeList - will connect to employee.service.js
export default function EmployeeList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Employees</h2>
          <p className="text-sm text-slate-500 mt-1">Manage all employee records</p>
        </div>
        <a
          href="/employees/add"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <span className="material-symbols-rounded text-[18px]">person_add</span>
          Add Employee
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <span className="material-symbols-rounded text-slate-300 text-5xl">groups</span>
        <p className="text-slate-500 mt-3 font-medium">Employee list will load here from API</p>
      </div>
    </div>
  );
}

// EmployeeDetailPage - single employee detail view
export default function EmployeeDetailPage({ params }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">Employee Detail</h2>
        <p className="text-sm text-slate-500 mt-1">ID: {params?.id}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <span className="material-symbols-rounded text-slate-300 text-5xl">person</span>
        <p className="text-slate-500 mt-3 font-medium">Employee details will load here from API</p>
      </div>
    </div>
  );
}

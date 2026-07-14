// Claims Approvals - will connect to backend API
export default function ClaimsApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">Claims Approvals</h2>
        <p className="text-sm text-slate-500 mt-1">Review and approve claim requests</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <span className="material-symbols-rounded text-slate-300 text-5xl">task_alt</span>
        <p className="text-slate-500 mt-3 font-medium">Claims Approvals data will load here from API</p>
      </div>
    </div>
  );
}

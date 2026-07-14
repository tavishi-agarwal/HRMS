import LeaveApprovalsTab from "./components/LeaveApprovalsTab";

export default function LeaveApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-800">Leave Approvals</h2>
        <p className="text-sm text-slate-500 mt-1">Review and approve leave requests from your team.</p>
      </div>
      <LeaveApprovalsTab />
    </div>
  );
}

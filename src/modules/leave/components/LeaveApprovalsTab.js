"use client";

import { useState, useEffect } from "react";
import { getPendingLeaves, approveLeave, rejectLeave } from "@/services/leave.service";

const TYPE_STYLES = {
  ANNUAL: "bg-purple-100 text-purple-700",
  SICK: "bg-orange-100 text-orange-700",
  CASUAL: "bg-pink-100 text-pink-700",
  MATERNITY: "bg-rose-100 text-rose-700",
  PATERNITY: "bg-sky-100 text-sky-700",
  UNPAID: "bg-slate-100 text-slate-700",
};

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-700",
  TL_APPROVED: "bg-blue-100 text-blue-700",
  HR_APPROVED: "bg-indigo-100 text-indigo-700",
};

export default function LeaveApprovalsTab() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // id of leave being actioned

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    const data = await getPendingLeaves();
    if (Array.isArray(data)) {
      setLeaves(data);
    } else {
      setError("Failed to load pending leaves. You may not have permission.");
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    const res = await approveLeave(id);
    if (res && res.id) {
      setLeaves((prev) => prev.filter((l) => l.id !== id));
    }
    setActionLoading(null);
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    const res = await rejectLeave(id);
    if (res && res.id) {
      setLeaves((prev) => prev.filter((l) => l.id !== id));
    }
    setActionLoading(null);
  };

  const daysBetween = (start, end) => {
    if (!start || !end) return "N/A";
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return `${diff} Day${diff !== 1 ? "s" : ""}`;
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border-2 border-indigo-500 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded">pending_actions</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pending</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{leaves.length}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-400 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded">schedule</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Awaiting TL</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{leaves.filter((l) => l.status === "PENDING").length}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-blue-400 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded">task_alt</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">TL Approved (HR Pending)</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{leaves.filter((l) => l.status === "TL_APPROVED").length}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </div>
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Pending Approvals Queue</h3>
          <button
            onClick={fetchPending}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-rounded text-[14px]">refresh</span>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4" />
            <p>Loading pending leaves...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <span className="material-symbols-rounded text-red-300 text-5xl">error</span>
            <p className="text-red-500 mt-3 font-medium">{error}</p>
          </div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-rounded text-slate-300 text-5xl">check_circle</span>
            <p className="text-slate-500 mt-3 font-medium">No pending leave applications. You're all caught up!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Leave ID</th>
                  <th className="px-6 py-4">Leave Type</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Days</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map((leave) => {
                  const isActioning = actionLoading === leave.id;
                  return (
                    <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-800">#{leave.id}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${TYPE_STYLES[leave.leaveType] || "bg-slate-100 text-slate-600"}`}>
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {leave.startDate} → {leave.endDate}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{daysBetween(leave.startDate, leave.endDate)}</td>
                      <td className="px-6 py-4 text-slate-500 max-w-[200px] truncate">{leave.reason || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLES[leave.status] || "bg-slate-100 text-slate-600"}`}>
                          {leave.status?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApprove(leave.id)}
                            disabled={isActioning}
                            title="Approve"
                            className="w-8 h-8 rounded-full border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition-colors disabled:opacity-50"
                          >
                            {isActioning ? (
                              <span className="material-symbols-rounded text-[14px] animate-spin">sync</span>
                            ) : (
                              <span className="material-symbols-rounded text-[18px]">check</span>
                            )}
                          </button>
                          <button
                            onClick={() => handleReject(leave.id)}
                            disabled={isActioning}
                            title="Reject"
                            className="w-8 h-8 rounded-full border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <span className="material-symbols-rounded text-[18px]">close</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

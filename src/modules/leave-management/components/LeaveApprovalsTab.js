"use client";

import React, { useState, useEffect } from "react";
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
  PENDING: "text-amber-600",
  TL_APPROVED: "text-blue-600",
  HR_APPROVED: "text-indigo-600",
};

export default function LeaveApprovalsTab() {
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingLeaves();
      if (Array.isArray(data)) {
        setPendingApprovals(data);
      } else {
        setError("Failed to load pending leaves. You may not have permission.");
      }
    } catch (err) {
      setError("An error occurred while fetching pending leaves.");
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    const res = await approveLeave(id);
    if (res && res.id) {
      setPendingApprovals((prev) => prev.filter((l) => l.id !== id));
    }
    setActionLoading(null);
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    const res = await rejectLeave(id);
    if (res && res.id) {
      setPendingApprovals((prev) => prev.filter((l) => l.id !== id));
    }
    setActionLoading(null);
  };

  const daysBetween = (start, end) => {
    if (!start || !end) return "N/A";
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return `${diff} Total Day${diff !== 1 ? "s" : ""}`;
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border-2 border-indigo-500 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded">pending_actions</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pending</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{pendingApprovals.length}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-pink-500 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded">task_alt</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Awaiting TL</p>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {pendingApprovals.filter(l => l.status === "PENDING").length}
            </h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-pink-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-amber-500 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded">flight_takeoff</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Awaiting HR</p>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {pendingApprovals.filter(l => l.status === "TL_APPROVED").length}
            </h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-red-500 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded">error</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Urgent Action</p>
            <h3 className="text-2xl font-extrabold text-slate-900">0</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-red-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pending Approvals Queue */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-800">Pending Approvals Queue</h3>
            <div className="flex gap-2">
              <button onClick={fetchPending} className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">
                <span className="material-symbols-rounded text-[14px]">refresh</span>
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex flex-col items-center text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4" />
                <p>Loading pending leaves...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center text-red-500">{error}</div>
            ) : pendingApprovals.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No pending leave applications.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-5 py-4">Leave ID</th>
                    <th className="px-5 py-4">Leave Type</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Reason</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {pendingApprovals.map((item) => {
                    const isActioning = actionLoading === item.id;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-5 py-4 font-bold text-slate-800">
                          #{item.id}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${TYPE_STYLES[item.leaveType] || "bg-slate-100 text-slate-700"}`}>
                            {item.leaveType}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">{item.startDate} to {item.endDate}</p>
                          <p className="text-xs text-slate-500">{daysBetween(item.startDate, item.endDate)}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-500 max-w-[150px] truncate">
                          {item.reason || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <div className={`flex items-center gap-1.5 font-medium text-xs ${STATUS_STYLES[item.status] || "text-slate-600"}`}>
                            <span className="material-symbols-rounded text-[14px]">schedule</span>
                            {item.status?.replace("_", " ")}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleApprove(item.id)}
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
                              onClick={() => handleReject(item.id)}
                              disabled={isActioning}
                              title="Reject"
                              className="w-8 h-8 rounded-full border border-red-200 text-red-600 flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50"
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
            )}
          </div>
        </div>

        {/* Right Column: Manage Leave Balances (Static as there's no API yet) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-rounded text-indigo-600 text-xl">account_balance_wallet</span>
            <h3 className="text-lg font-bold text-slate-800">Manage Leave Balances</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            Adjust or credit leave days for specific employees. (API integration pending)
          </p>

          <form className="space-y-5 flex-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select Employee</label>
              <div className="relative">
                <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                <input
                  type="text"
                  disabled
                  placeholder="Search by name or ID..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Category</label>
                <select disabled className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm outline-none cursor-not-allowed">
                  <option>Annual Leave</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Quantity (Days)</label>
                <input
                  type="number"
                  disabled
                  defaultValue={1}
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Reason/Remarks</label>
              <textarea
                disabled
                rows="3"
                placeholder="e.g., Performance reward..."
                className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm outline-none resize-none cursor-not-allowed"
              ></textarea>
            </div>

            <button
              type="button"
              disabled
              className="w-full py-3 bg-indigo-400 text-white text-sm font-bold rounded-lg shadow-md flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <span className="material-symbols-rounded text-lg">sync_alt</span>
              Update Balance
            </button>
          </form>

          {/* Quick Insight */}
          <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <span className="material-symbols-rounded text-blue-500 text-lg shrink-0">lightbulb</span>
            <p className="text-xs text-blue-900 leading-relaxed">
              <strong>Info:</strong> Manual leave balance adjustments will be available in the next backend update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

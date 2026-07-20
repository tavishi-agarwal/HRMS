"use client";

import React, { useState, useEffect } from "react";
import { getPendingLeaves, getAllLeaves, approveLeave, rejectLeave, getLeaveStats } from "@/services/leave.service";
import { useAuth } from "@/hooks/useAuth";

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
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function LeaveApprovalsTab() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState("pending"); // "pending" | "all"
  const [statusFilter, setStatusFilter] = useState(""); // "" | "PENDING" | "APPROVED" | "REJECTED"
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [stats, setStats] = useState({ totalPending: 0, approved: 0, rejected: 0, totalLeaves: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  useEffect(() => {
    fetchData();
  }, [viewMode, page, statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats
      const statsRes = await getLeaveStats();
      if (statsRes) {
        const approved = statsRes.APPROVED || 0;
        const rejected = statsRes.REJECTED || 0;
        const totalPending = 
          (statsRes.PENDING || 0) + 
          (statsRes.PENDING_TL_APPROVAL || 0) + 
          (statsRes.PENDING_HR_APPROVAL || 0) + 
          (statsRes.PENDING_ADMIN_APPROVAL || 0);
        
        const totalLeaves = Object.values(statsRes).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);

        setStats({
          totalPending,
          approved,
          rejected,
          totalLeaves
        });
      }

      // Fetch list based on viewMode
      if (viewMode === "pending") {
        const pendingRes = await getPendingLeaves();
        setPendingApprovals(Array.isArray(pendingRes) ? pendingRes : []);
      } else {
        const allRes = await getAllLeaves(page, size, statusFilter);
        if (allRes && Array.isArray(allRes.content)) {
          setAllLeaves(allRes.content);
          setTotalPages(allRes.totalPages || 1);
        } else {
          setAllLeaves([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
      setError("An error occurred while fetching data.");
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    const res = await approveLeave(id);
    if (res && res.id) {
      fetchData();
    }
    setActionLoading(null);
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    const res = await rejectLeave(id);
    if (res && res.id) {
      fetchData();
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

  const leavesToDisplay = viewMode === "pending" ? pendingApprovals : allLeaves;

  return (
    <div className="space-y-6 fade-in">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-indigo-500 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded">pending_actions</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Pending</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalPending || 0}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </div>

        {/* Card 2 - Approved */}
        <div 
          onClick={() => { setViewMode("all"); setStatusFilter("APPROVED"); setPage(0); }}
          className="bg-white p-5 rounded-2xl border border-emerald-500 shadow-sm flex items-center gap-4 relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded">task_alt</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Approved Leaves</p>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {stats.approved || 0}
            </h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </div>

        {/* Card 3 - Rejected */}
        <div 
          onClick={() => { setViewMode("all"); setStatusFilter("REJECTED"); setPage(0); }}
          className="bg-white p-5 rounded-2xl border border-red-500 shadow-sm flex items-center gap-4 relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded">block</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Rejected Leaves</p>
            <h3 className="text-2xl font-extrabold text-slate-900">
              {stats.rejected || 0}
            </h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-red-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-red-500 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-rounded">history</span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Leaves</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{stats.totalLeaves || 0}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Approvals Queue & All Leaves */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex gap-4">
              <button
                onClick={() => { setViewMode("pending"); setStatusFilter(""); }}
                className={`text-sm font-bold pb-1 border-b-2 transition-colors ${viewMode === "pending" ? "text-indigo-600 border-indigo-600" : "text-slate-400 border-transparent hover:text-slate-600"}`}
              >
                Pending Approvals
              </button>
              <button
                onClick={() => { setViewMode("all"); setPage(0); }}
                className={`text-sm font-bold pb-1 border-b-2 transition-colors ${viewMode === "all" ? "text-indigo-600 border-indigo-600" : "text-slate-400 border-transparent hover:text-slate-600"}`}
              >
                All Leaves
              </button>
            </div>
            <div className="flex gap-2">
              {viewMode === "all" && (
                <select 
                  value={statusFilter} 
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              )}
              <button
                onClick={fetchData}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-rounded text-[14px]">refresh</span>
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {loading ? (
              <div className="p-12 flex flex-col items-center text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4" />
                <p>Loading leaves...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center text-red-500">{error}</div>
            ) : leavesToDisplay.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No leave applications found in {viewMode} mode.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-5 py-4">Employee & ID</th>
                    <th className="px-5 py-4">Leave Type</th>
                    <th className="px-5 py-4">Duration</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {leavesToDisplay.map((item) => {
                    const isActioning = actionLoading === item.id;
                    const canTakeAction = item.status !== "APPROVED" && item.status !== "REJECTED";

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-800">{item.userName || `User #${item.userId}`}</p>
                          <p className="text-xs text-slate-400">Leave #{item.id}</p>
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
                        <td className="px-5 py-4">
                          <div className={`flex items-center gap-1.5 font-medium text-xs ${STATUS_STYLES[item.status] || "text-slate-600"}`}>
                            <span className="material-symbols-rounded text-[14px]">
                              {item.status === 'APPROVED' ? 'check_circle' : item.status === 'REJECTED' ? 'cancel' : 'schedule'}
                            </span>
                            {item.status?.replace("_", " ")}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {canTakeAction ? (
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
                          ) : (
                            <div className="flex justify-center">
                              <span className="text-xs text-slate-400 italic">No action</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* Pagination for All Leaves Mode */}
            {viewMode === "all" && totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-xs font-medium text-slate-500">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Manage Leave Balances (Static as there's no API yet) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-rounded text-indigo-600 text-xl">account_balance_wallet</span>
            <h3 className="text-lg font-bold text-slate-800">Manage Balances</h3>
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

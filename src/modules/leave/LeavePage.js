"use client";

import { useState, useEffect } from "react";
import { getMyLeaves, getMyBalances, applyLeave } from "@/services/leave.service";

const LEAVE_TYPES = ["ANNUAL", "SICK", "CASUAL", "MATERNITY", "PATERNITY", "UNPAID"];

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
  TL_APPROVED: "bg-blue-100 text-blue-700",
  HR_APPROVED: "bg-indigo-100 text-indigo-700",
};

const TYPE_STYLES = {
  ANNUAL: "bg-purple-100 text-purple-700",
  SICK: "bg-orange-100 text-orange-700",
  CASUAL: "bg-pink-100 text-pink-700",
  MATERNITY: "bg-rose-100 text-rose-700",
  PATERNITY: "bg-sky-100 text-sky-700",
  UNPAID: "bg-slate-100 text-slate-700",
};

export default function LeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    leaveType: "ANNUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [leavesData, balancesData] = await Promise.all([
      getMyLeaves(),
      getMyBalances(),
    ]);
    setLeaves(Array.isArray(leavesData) ? leavesData : []);
    setBalances(Array.isArray(balancesData) ? balancesData : []);
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await applyLeave(form);
      if (res && res.id) {
        setMessage({ type: "success", text: "Leave application submitted successfully!" });
        setForm({ leaveType: "ANNUAL", startDate: "", endDate: "", reason: "" });
        setShowApplyForm(false);
        await fetchData();
      } else {
        setMessage({ type: "error", text: res?.message || "Failed to apply. Try again." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err?.message || "An error occurred." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">My Leaves</h2>
          <p className="text-sm text-slate-500 mt-1">View your leave history and apply for new leave.</p>
        </div>
        <button
          onClick={() => setShowApplyForm(!showApplyForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <span className="material-symbols-rounded text-[18px]">
            {showApplyForm ? "close" : "add"}
          </span>
          {showApplyForm ? "Cancel" : "Apply for Leave"}
        </button>
      </div>

      {/* Alert */}
      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-medium text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
          <span className="material-symbols-rounded">{message.type === "success" ? "check_circle" : "error"}</span>
          {message.text}
        </div>
      )}

      {/* Apply Leave Form */}
      {showApplyForm && (
        <form onSubmit={handleApply} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-rounded text-indigo-600">edit_calendar</span>
              Apply for Leave
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leave Type *</label>
              <select name="leaveType" value={form.leaveType} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all">
                {LEAVE_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()} Leave</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</label>
              <input type="text" name="reason" value={form.reason} onChange={handleChange} placeholder="Brief reason..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date *</label>
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Date *</label>
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all" />
            </div>
          </div>
          <div className="px-6 pb-6 flex justify-end">
            <button type="submit" disabled={submitting} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-70">
              <span className="material-symbols-rounded text-[18px]">send</span>
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      )}

      {/* Leave Balances */}
      {balances.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {balances.map((b) => (
            <div key={b.leaveType} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-center">
              <p className="text-xs font-bold text-slate-500 uppercase">{b.leaveType}</p>
              <p className="text-3xl font-extrabold text-indigo-600 mt-1">{b.remaining}</p>
              <p className="text-xs text-slate-400 mt-1">{b.utilized} used / {b.totalAllowed} total</p>
            </div>
          ))}
        </div>
      )}

      {/* Leave History Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Leave History</h3>
        </div>
        {loading ? (
          <div className="p-12 flex flex-col items-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4" />
            <p>Loading leaves...</p>
          </div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-rounded text-slate-300 text-5xl">beach_access</span>
            <p className="text-slate-500 mt-3 font-medium">No leave applications yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Leave Type</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">End Date</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${TYPE_STYLES[leave.leaveType] || "bg-slate-100 text-slate-600"}`}>
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{leave.startDate}</td>
                    <td className="px-6 py-4 font-medium">{leave.endDate}</td>
                    <td className="px-6 py-4 text-slate-500">{leave.reason || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${STATUS_STYLES[leave.status] || "bg-slate-100 text-slate-600"}`}>
                        {leave.status?.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

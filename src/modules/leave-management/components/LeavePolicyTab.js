"use client";

import React, { useState, useEffect } from "react";
import { getAllPolicies, updatePolicy } from "@/services/leave.service";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/constants/roles";

const TYPE_STYLES = {
  ANNUAL: "bg-purple-100 text-purple-700",
  SICK: "bg-orange-100 text-orange-700",
  CASUAL: "bg-pink-100 text-pink-700",
  MATERNITY: "bg-rose-100 text-rose-700",
  PATERNITY: "bg-sky-100 text-sky-700",
  UNPAID: "bg-slate-100 text-slate-700",
};

export default function LeavePolicyTab() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingPolicy, setEditingPolicy] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const isHR = user?.role === ROLES.HR || user?.role === ROLES.ADMIN;

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPolicies();
      if (Array.isArray(data)) {
        setPolicies(data);
      } else {
        setError("Failed to load leave policies.");
      }
    } catch (err) {
      setError("An error occurred while fetching policies.");
    }
    setLoading(false);
  };

  const handleEdit = (policy) => {
    setEditingPolicy(policy.leaveType);
    setEditValue(policy.defaultAllowed);
  };

  const handleSave = async (leaveType) => {
    setUpdateLoading(true);
    try {
      await updatePolicy(leaveType, parseInt(editValue, 10) || 0);
      await fetchPolicies();
      setEditingPolicy(null);
    } catch (err) {
      alert("Failed to update leave policy.");
    }
    setUpdateLoading(false);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col max-w-4xl">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Leave Policies</h3>
            <p className="text-xs text-slate-500">Manage default allowed leave days per category.</p>
          </div>
          <button 
            onClick={fetchPolicies} 
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-rounded text-[14px]">refresh</span>
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto min-h-[200px]">
          {loading ? (
            <div className="p-12 flex flex-col items-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4" />
              <p>Loading policies...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">{error}</div>
          ) : policies.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No leave policies found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-4">Leave Type</th>
                  <th className="px-5 py-4 text-center">Default Allowed Days</th>
                  {isHR && <th className="px-5 py-4 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${TYPE_STYLES[policy.leaveType] || "bg-slate-100 text-slate-700"}`}>
                        {policy.leaveType}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-slate-800">
                      {editingPolicy === policy.leaveType ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 text-center px-2 py-1 bg-slate-100 border border-slate-200 rounded-md outline-none focus:border-indigo-500"
                        />
                      ) : (
                        <span>{policy.defaultAllowed} Days</span>
                      )}
                    </td>
                    {isHR && (
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {editingPolicy === policy.leaveType ? (
                            <>
                              <button
                                onClick={() => handleSave(policy.leaveType)}
                                disabled={updateLoading}
                                className="w-8 h-8 rounded-full border border-emerald-200 text-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition-colors disabled:opacity-50"
                                title="Save"
                              >
                                {updateLoading ? (
                                  <span className="material-symbols-rounded text-[14px] animate-spin">sync</span>
                                ) : (
                                  <span className="material-symbols-rounded text-[16px]">check</span>
                                )}
                              </button>
                              <button
                                onClick={() => setEditingPolicy(null)}
                                disabled={updateLoading}
                                className="w-8 h-8 rounded-full border border-red-200 text-red-600 flex items-center justify-center hover:bg-red-50 transition-colors disabled:opacity-50"
                                title="Cancel"
                              >
                                <span className="material-symbols-rounded text-[16px]">close</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEdit(policy)}
                              className="w-8 h-8 rounded-full border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-rounded text-[16px]">edit</span>
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

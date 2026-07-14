"use client";

import React, { useState } from "react";
import LeaveApprovalsTab from "./components/LeaveApprovalsTab";
import HolidaysTab from "./components/HolidaysTab";

export default function LeaveManagementPage() {
  const [activeTab, setActiveTab] = useState("approvals");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Leave Approvals & Management</h2>
        <p className="text-base text-slate-500 mt-1 max-w-2xl">
          Review pending requests and manage employee leave balances effortlessly.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("approvals")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "approvals"
              ? "text-indigo-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Approvals & Balances
          {activeTab === "approvals" && (
            <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("holidays")}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === "holidays"
              ? "text-indigo-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Company Holidays
          {activeTab === "holidays" && (
            <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-indigo-600 rounded-t-full" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="pt-2">
        {activeTab === "approvals" && <LeaveApprovalsTab />}
        {activeTab === "holidays" && <HolidaysTab />}
      </div>
    </div>
  );
}

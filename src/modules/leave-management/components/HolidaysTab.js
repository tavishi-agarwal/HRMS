"use client";

import React, { useState, useEffect } from "react";
import { getAllHolidays, createHoliday, deleteHoliday, updateHoliday } from "@/services/holiday.service";
import { useAuth } from "@/context/AuthContext";
import { ROLES } from "@/constants/roles";

export default function HolidaysTab() {
  const { user } = useAuth();
  const role = user?.role;
  const isHR = role === ROLES.HR || role === ROLES.ADMIN;

  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // New holiday form state
  const [newHoliday, setNewHoliday] = useState({ date: "", name: "" });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const data = await getAllHolidays();
      if (Array.isArray(data)) {
        setHolidays(data);
      } else {
        setError("Failed to fetch holidays.");
      }
    } catch (err) {
      setError("An error occurred while fetching holidays.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this holiday?")) {
      try {
        await deleteHoliday(id);
        setHolidays(holidays.filter(h => h.id !== id));
      } catch (err) {
        alert("Failed to delete holiday.");
      }
    }
  };

  const handleEditClick = (holiday) => {
    setEditingId(holiday.id);
    setNewHoliday({ date: holiday.startDate, name: holiday.name });
    setShowModal(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setNewHoliday({ date: "", name: "" });
    setShowModal(true);
  };

  const handleSaveHoliday = async (e) => {
    e.preventDefault();
    if (!newHoliday.date || !newHoliday.name) return;

    setActionLoading(true);
    try {
      const payload = {
        name: newHoliday.name,
        startDate: newHoliday.date,
        endDate: newHoliday.date,
      };

      if (editingId) {
        const res = await updateHoliday(editingId, payload);
        if (res && res.id) {
          setHolidays(holidays.map(h => h.id === editingId ? res : h));
          setShowModal(false);
        } else {
          alert("Failed to update holiday.");
        }
      } else {
        const res = await createHoliday(payload);
        if (res && res.id) {
          setHolidays([...holidays, res]);
          setShowModal(false);
        } else {
          alert("Failed to create holiday.");
        }
      }
    } catch (err) {
      alert("An error occurred while saving the holiday.");
    }
    setActionLoading(false);
  };

  const getFormattedDateAndDay = (dateString) => {
    if (!dateString) return { formatted: "", day: "", month: "", dayNum: "" };
    const dateObj = new Date(dateString);
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
    const formatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    return { formatted, day: dayName, month, dayNum };
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col fade-in relative">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Company Holidays</h3>
          <p className="text-sm text-slate-500 mt-1">List of official holidays for the current year.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <span className="material-symbols-rounded text-[18px]">calendar_month</span>
            Download Calendar
          </button>
          
          {isHR && (
            <button 
              onClick={handleAddClick}
              className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg shadow-sm shadow-slate-900/20 hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-rounded text-[18px]">add</span>
              Add Holiday
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 flex flex-col items-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4" />
            <p>Loading holidays...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 font-medium">{error}</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Day</th>
                <th className="px-6 py-4">Holiday Name</th>
                {isHR && <th className="px-6 py-4 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {holidays.map((holiday) => {
                const dateInfo = getFormattedDateAndDay(holiday.startDate);
                return (
                  <tr key={holiday.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center border border-indigo-100/50 shrink-0">
                          <span className="text-[10px] font-bold uppercase leading-none">{dateInfo.month}</span>
                          <span className="text-sm font-extrabold leading-none mt-0.5">{dateInfo.dayNum}</span>
                        </div>
                        <span className="font-semibold text-slate-800">{dateInfo.formatted}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {dateInfo.day}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{holiday.name}</span>
                    </td>
                    {isHR && (
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditClick(holiday)}
                            className="w-8 h-8 rounded-full border border-blue-200 text-blue-600 inline-flex items-center justify-center hover:bg-blue-50 transition-colors"
                            title="Edit Holiday"
                          >
                            <span className="material-symbols-rounded text-[18px]">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(holiday.id)}
                            className="w-8 h-8 rounded-full border border-red-200 text-red-600 inline-flex items-center justify-center hover:bg-red-50 transition-colors"
                            title="Delete Holiday"
                          >
                            <span className="material-symbols-rounded text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
              {holidays.length === 0 && (
                <tr>
                  <td colSpan={isHR ? 4 : 3} className="px-6 py-8 text-center text-slate-500">
                    No holidays found. Click "Add Holiday" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Holiday Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">
                {editingId ? "Edit Holiday" : "Add New Holiday"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveHoliday} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Holiday Name</label>
                <input 
                  type="text" 
                  required
                  value={newHoliday.name}
                  onChange={e => setNewHoliday({...newHoliday, name: e.target.value})}
                  placeholder="e.g. Diwali"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Date</label>
                <input 
                  type="date" 
                  required
                  value={newHoliday.date}
                  onChange={e => setNewHoliday({...newHoliday, date: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-50 transition-all"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
                >
                  {actionLoading ? "Saving..." : (editingId ? "Update Holiday" : "Save Holiday")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

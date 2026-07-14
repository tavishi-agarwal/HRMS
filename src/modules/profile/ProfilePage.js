"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import profileService from "@/services/profile.service";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    employeeCode: "",
    dateOfBirth: "",
    dateOfJoining: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    country: "",
    department: "",
    salary: "",
    aadharNumber: "",
    panNumber: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfileByUserId(user.id);
      if (data) {
        const safeData = Object.keys(data).reduce((acc, key) => {
          acc[key] = data[key] !== null ? data[key] : "";
          return acc;
        }, {});
        
        setFormData((prev) => ({
          ...prev,
          ...safeData
        }));
      }
    } catch (error) {
      console.log("No existing profile found or error fetching. You can create a new one.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
      };
      await profileService.saveOrUpdateProfile(user.id, payload);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Failed to update profile", error);
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl fade-in">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h2>
        <p className="text-base text-slate-500 mt-1">Manage your personal and employment information.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          <span className="material-symbols-rounded">{message.type === 'success' ? 'check_circle' : 'error'}</span>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Section with Avatar */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-4xl font-bold shrink-0 border-4 border-white shadow-md">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
            <p className="text-sm font-medium text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Employment Details */}
          <section>
            <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Employment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input type="email" name="email" value={formData.email || ""} readOnly className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" placeholder="Set by HR" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">System Role</label>
                  <input type="text" name="role" value={formData.role || ""} readOnly className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed font-semibold" placeholder="Set by System" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Employee Code</label>
                <input type="text" name="employeeCode" value={formData.employeeCode || ""} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Designation</label>
                <input type="text" name="designation" value={formData.designation || ""} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" placeholder="Set by HR" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Department</label>
                <input type="text" name="department" value={formData.department || ""} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" placeholder="Set by HR" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Salary</label>
                <input type="number" name="salary" value={formData.salary || ""} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" placeholder="Set by HR" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Date of Joining</label>
                <input type="date" name="dateOfJoining" value={formData.dateOfJoining || ""} readOnly className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" />
              </div>
            </div>
          </section>

          {/* Personal Details */}
          <section>
            <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">First Name</label>
                <input type="text" name="firstName" value={formData.firstName || ""} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName || ""} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Phone</label>
                <input type="tel" name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Gender</label>
                <select name="gender" value={formData.gender || ""} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth || ""} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Aadhar Number</label>
                <input type="text" name="aadharNumber" value={formData.aadharNumber || ""} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">PAN Number</label>
                <input type="text" name="panNumber" value={formData.panNumber || ""} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
              </div>
            </div>
          </section>

          {/* Address Details */}
          <section>
            <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Address</h4>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Address Line</label>
                <textarea name="address" rows="2" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Country</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className={`px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving ? (
              <span className="material-symbols-rounded animate-spin text-[18px]">sync</span>
            ) : (
              <span className="material-symbols-rounded text-[18px]">save</span>
            )}
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

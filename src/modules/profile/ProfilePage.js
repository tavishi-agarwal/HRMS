"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import profileService from "@/services/profile.service";
import { apiDownload, apiPreview } from "@/lib/api/apiDownload";
import { ENDPOINTS } from "@/constants/endpoints";

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [docType, setDocType] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);

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
      if (payload.documents === "") {
        payload.documents = [];
      }
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

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!docFile || !docType) {
       setMessage({ type: "error", text: "Please select a document type and file." });
       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
       return;
    }
    if (!formData.id) {
       setMessage({ type: "error", text: "Please save your profile first before uploading documents." });
       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
       return;
    }
    
    setUploadingDoc(true);
    try {
       await profileService.uploadDocument(formData.id, docType, docFile);
       setMessage({ type: "success", text: "Document uploaded successfully!" });
       setDocFile(null);
       setDocType("");
       // Reset file input by finding it by id
       const fileInput = document.getElementById("docFileInput");
       if (fileInput) fileInput.value = "";
       // Refetch profile to get the new document list
       fetchProfile();
    } catch (err) {
       setMessage({ type: "error", text: "Failed to upload document." });
    } finally {
       setUploadingDoc(false);
       setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const handlePreview = async (doc) => {
    try {
      const filename = doc.documentName || "document.pdf";
      const blobUrl = await apiPreview(ENDPOINTS.EMPLOYEES.DOWNLOAD_DOCUMENT(doc.id), filename);
      setPreviewDoc({
        name: filename,
        url: blobUrl,
        type: filename.toLowerCase().endsWith('pdf') ? 'pdf' : 'image'
      });
    } catch (err) {
      console.error("Failed to preview:", err);
      setMessage({ type: "error", text: "Failed to load document preview." });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    }
  };

  const closePreview = () => {
    if (previewDoc?.url) {
      URL.revokeObjectURL(previewDoc.url);
    }
    setPreviewDoc(null);
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

          {/* Documents Section */}
          <section>
            <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Documents</h4>
            
            {/* Uploaded Documents List */}
            {formData.documents && formData.documents.length > 0 && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="material-symbols-rounded text-indigo-500">description</span>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{doc.documentType}</p>
                        <p className="text-xs text-slate-500 truncate">{doc.documentName || doc.fileName}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        type="button"
                        onClick={() => handlePreview(doc)}
                        className="text-slate-600 hover:text-indigo-600 p-2 focus:outline-none transition-colors"
                        title="Preview Document"
                      >
                        <span className="material-symbols-rounded text-xl">visibility</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => apiDownload(ENDPOINTS.EMPLOYEES.DOWNLOAD_DOCUMENT(doc.id), doc.documentName || "document")}
                        className="text-indigo-600 hover:text-indigo-800 p-2 focus:outline-none transition-colors"
                        title="Download Document"
                      >
                        <span className="material-symbols-rounded text-xl">download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Document Upload Form */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <h5 className="text-sm font-bold text-slate-800 mb-4">Upload New Document</h5>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Document Type</label>
                  <select 
                    value={docType} 
                    onChange={(e) => setDocType(e.target.value)} 
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Select Type</option>
                    <option value="Aadhar Card">Aadhar Card</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Resume">Resume</option>
                    <option value="Offer Letter">Offer Letter</option>
                    <option value="Relieving Letter">Relieving Letter</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Select File</label>
                  <input 
                    id="docFileInput"
                    type="file" 
                    onChange={(e) => setDocFile(e.target.files[0])} 
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleUploadDocument}
                  disabled={uploadingDoc || !docFile || !docType}
                  className={`px-6 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-lg shadow-md hover:bg-slate-900 transition-all flex items-center gap-2 ${uploadingDoc || !docFile || !docType ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploadingDoc ? (
                    <span className="material-symbols-rounded animate-spin text-[18px]">sync</span>
                  ) : (
                    <span className="material-symbols-rounded text-[18px]">upload</span>
                  )}
                  {uploadingDoc ? "Uploading..." : "Upload"}
                </button>
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

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-rounded text-indigo-600">visibility</span>
                {previewDoc.name}
              </h3>
              <button type="button" onClick={closePreview} className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-full hover:bg-slate-200 transition-colors">
                <span className="material-symbols-rounded">close</span>
              </button>
            </div>
            <div className="p-6 overflow-auto flex-1 bg-slate-100/50 flex justify-center items-start min-h-[50vh]">
              {previewDoc.type === 'pdf' ? (
                <iframe src={previewDoc.url} className="w-full h-[70vh] rounded border border-slate-200" title={previewDoc.name} />
              ) : (
                <img src={previewDoc.url} alt={previewDoc.name} className="max-w-full rounded shadow-sm" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

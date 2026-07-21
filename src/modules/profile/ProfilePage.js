"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import profileService from "@/services/profile.service";
import { apiDownload, apiPreview } from "@/lib/api/apiDownload";
import { ENDPOINTS } from "@/constants/endpoints";

const SECTIONS = [
  { id: "employment", label: "Employment", icon: "work" },
  { id: "personal", label: "Personal", icon: "badge" },
  { id: "address", label: "Address", icon: "home" },
  { id: "documents", label: "Documents", icon: "folder" },
];

const REQUIRED_PERSONAL_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "gender",
  "dateOfBirth",
  "aadharNumber",
  "panNumber",
];
const REQUIRED_ADDRESS_FIELDS = ["address", "city", "state", "country"];

const VALIDATORS = {
  phone: {
    test: (v) => !v || /^[0-9]{10}$/.test(v),
    message: "Enter a 10-digit phone number",
  },
  aadharNumber: {
    test: (v) => !v || /^\d{12}$/.test(v),
    message: "Aadhar number must be 12 digits",
  },
  panNumber: {
    test: (v) => !v || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(v),
    message: "PAN format should be like ABCDE1234F",
  },
};

const ALLOWED_DOC_TYPES = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];
const MAX_DOC_SIZE_MB = 5;

const DOC_ICON_BY_EXT = {
  pdf: "picture_as_pdf",
  jpg: "image",
  jpeg: "image",
  png: "image",
  doc: "description",
  docx: "description",
};

function getExt(filename = "") {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

let toastId = 0;

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toasts, setToasts] = useState([]);

  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [docType, setDocType] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [docSearch, setDocSearch] = useState("");

  const [touched, setTouched] = useState({});
  const [activeSection, setActiveSection] = useState("employment");

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

  const initialSnapshot = useRef(JSON.stringify(formData));
  const sectionRefs = useRef({});
  const fileInputRef = useRef(null);

  const addToast = useCallback((type, text) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

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

        setFormData((prev) => {
          const next = { ...prev, ...safeData };
          initialSnapshot.current = JSON.stringify(next);
          return next;
        });
      }
    } catch (error) {
      console.log("No existing profile found or error fetching. You can create a new one.");
    } finally {
      setLoading(false);
    }
  };

  const isDirty = useMemo(
    () => JSON.stringify(formData) !== initialSnapshot.current,
    [formData]
  );

  useEffect(() => {
    const handler = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Track which section is in view for the side nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.dataset.section);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [loading]);

  const scrollToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const fieldError = (name) => {
    if (!touched[name]) return null;
    const validator = VALIDATORS[name];
    if (!validator) return null;
    return validator.test(formData[name]) ? null : validator.message;
  };

  const hasBlockingErrors = useMemo(() => {
    return Object.keys(VALIDATORS).some((name) => {
      const validator = VALIDATORS[name];
      return formData[name] && !validator.test(formData[name]);
    });
  }, [formData]);

  const completeness = useMemo(() => {
    const fields = [...REQUIRED_PERSONAL_FIELDS, ...REQUIRED_ADDRESS_FIELDS];
    const filled = fields.filter((f) => String(formData[f] || "").trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // touch all validated fields so errors surface on submit attempt
    setTouched((prev) => ({
      ...prev,
      ...Object.keys(VALIDATORS).reduce((acc, k) => ({ ...acc, [k]: true }), {}),
    }));

    if (hasBlockingErrors) {
      addToast("error", "Please fix the highlighted fields before saving.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
      };
      if (!Array.isArray(payload.documents)) {
        payload.documents = Array.isArray(formData.documents) ? formData.documents : [];
      }
      await profileService.saveOrUpdateProfile(user.id, payload);
      initialSnapshot.current = JSON.stringify(formData);
      addToast("success", "Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      addToast("error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    const ext = "." + getExt(file.name);
    if (!ALLOWED_DOC_TYPES.includes(ext)) {
      addToast("error", `Unsupported file type. Allowed: ${ALLOWED_DOC_TYPES.join(", ")}`);
      return;
    }
    if (file.size > MAX_DOC_SIZE_MB * 1024 * 1024) {
      addToast("error", `File is too large. Max size is ${MAX_DOC_SIZE_MB}MB.`);
      return;
    }
    setDocFile(file);
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!docFile || !docType) {
      addToast("error", "Please select a document type and file.");
      return;
    }
    if (!formData.id) {
      addToast("error", "Please save your profile first before uploading documents.");
      return;
    }

    setUploadingDoc(true);
    try {
      await profileService.uploadDocument(formData.id, docType, docFile);
      addToast("success", "Document uploaded successfully!");
      setDocFile(null);
      setDocType("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchProfile();
    } catch (err) {
      addToast("error", "Failed to upload document.");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handlePreview = async (doc) => {
    try {
      const filename = doc.documentName || "document.pdf";
      const blobUrl = await apiPreview(ENDPOINTS.EMPLOYEES.DOWNLOAD_DOCUMENT(doc.id), filename);
      setPreviewDoc({
        name: filename,
        url: blobUrl,
        type: filename.toLowerCase().endsWith("pdf") ? "pdf" : "image",
      });
    } catch (err) {
      console.error("Failed to preview:", err);
      addToast("error", "Failed to load document preview.");
    }
  };

  const closePreview = () => {
    if (previewDoc?.url) {
      URL.revokeObjectURL(previewDoc.url);
    }
    setPreviewDoc(null);
  };

  const filteredDocuments = useMemo(() => {
    const docs = formData.documents || [];
    if (!docSearch.trim()) return docs;
    const q = docSearch.trim().toLowerCase();
    return docs.filter(
      (d) =>
        (d.documentType || "").toLowerCase().includes(q) ||
        (d.documentName || d.fileName || "").toLowerCase().includes(q)
    );
  }, [formData.documents, docSearch]);

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded"></div>
        <div className="h-40 bg-slate-200 rounded-2xl"></div>
        <div className="h-64 bg-slate-200 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl fade-in">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`p-4 rounded-xl shadow-lg flex items-start gap-3 font-medium text-sm border animate-in fade-in slide-in-from-top-2 ${
              t.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-red-50 text-red-700 border-red-100"
            }`}
          >
            <span className="material-symbols-rounded text-lg">
              {t.type === "success" ? "check_circle" : "error"}
            </span>
            <span className="flex-1">{t.text}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h2>
          <p className="text-base text-slate-500 mt-1">Manage your personal and employment information.</p>
        </div>
        {isDirty && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
            <span className="material-symbols-rounded text-sm">edit</span>
            Unsaved changes
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Side navigation + completeness */}
        <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">Profile completeness</span>
              <span className="text-xs font-bold text-indigo-600">{completeness}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          <nav className="bg-white border border-slate-200 rounded-2xl p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSection(s.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeSection === s.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="material-symbols-rounded text-lg">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-4xl font-bold shrink-0 border-4 border-white shadow-md">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
              <p className="text-sm font-medium text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* Employment Details */}
            <section ref={(el) => (sectionRefs.current.employment = el)} data-section="employment" id="employment">
              <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                Employment Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-700">Email Address</label>
                  <input type="email" name="email" value={formData.email || ""} readOnly className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" placeholder="Set by HR" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">System Role</label>
                  <input type="text" name="role" value={formData.role || ""} readOnly className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed font-semibold" placeholder="Set by System" />
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
            <section ref={(el) => (sectionRefs.current.personal = el)} data-section="personal" id="personal">
              <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">First Name</label>
                  <input type="text" name="firstName" value={formData.firstName || ""} onChange={handleChange} onBlur={handleBlur} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName || ""} onChange={handleChange} onBlur={handleBlur} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 transition-all ${
                      fieldError("phone")
                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                  />
                  {fieldError("phone") && <p className="text-xs text-red-600 mt-1">{fieldError("phone")}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Gender</label>
                  <select name="gender" value={formData.gender || ""} onChange={handleChange} onBlur={handleBlur} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth || ""} onChange={handleChange} onBlur={handleBlur} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Aadhar Number</label>
                  <input
                    type="text"
                    name="aadharNumber"
                    value={formData.aadharNumber || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={12}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 transition-all ${
                      fieldError("aadharNumber")
                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                  />
                  {fieldError("aadharNumber") && <p className="text-xs text-red-600 mt-1">{fieldError("aadharNumber")}</p>}
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700">PAN Number</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, panNumber: e.target.value.toUpperCase() }))}
                    onBlur={handleBlur}
                    maxLength={10}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 transition-all uppercase ${
                      fieldError("panNumber")
                        ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                        : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                  />
                  {fieldError("panNumber") && <p className="text-xs text-red-600 mt-1">{fieldError("panNumber")}</p>}
                </div>
              </div>
            </section>

            {/* Address Details */}
            <section ref={(el) => (sectionRefs.current.address = el)} data-section="address" id="address">
              <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Address</h4>
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Address Line</label>
                  <textarea name="address" rows="2" value={formData.address || ""} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">City</label>
                    <input type="text" name="city" value={formData.city || ""} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">State</label>
                    <input type="text" name="state" value={formData.state || ""} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Country</label>
                    <input type="text" name="country" value={formData.country || ""} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                  </div>
                </div>
              </div>
            </section>

            {/* Documents Section */}
            <section ref={(el) => (sectionRefs.current.documents = el)} data-section="documents" id="documents">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Documents</h4>
                {formData.documents && formData.documents.length > 0 && (
                  <span className="text-xs font-semibold text-slate-500">
                    {formData.documents.length} file{formData.documents.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {formData.documents && formData.documents.length > 0 && (
                <>
                  <div className="relative mb-4">
                    <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input
                      type="text"
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      placeholder="Search documents..."
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  {filteredDocuments.length === 0 ? (
                    <p className="text-sm text-slate-500 mb-6">No documents match "{docSearch}".</p>
                  ) : (
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredDocuments.map((doc, idx) => {
                        const ext = getExt(doc.documentName || doc.fileName || "");
                        const icon = DOC_ICON_BY_EXT[ext] || "description";
                        return (
                          <div key={doc.id ?? idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50 hover:border-indigo-200 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <span className="material-symbols-rounded text-indigo-500 shrink-0">{icon}</span>
                              <div className="overflow-hidden">
                                <p className="text-sm font-bold text-slate-800">{doc.documentType}</p>
                                <p className="text-xs text-slate-500 truncate">{doc.documentName || doc.fileName}</p>
                              </div>
                            </div>
                            <div className="flex items-center shrink-0">
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
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {(!formData.documents || formData.documents.length === 0) && (
                <div className="mb-6 flex flex-col items-center justify-center text-center py-8 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <span className="material-symbols-rounded text-3xl text-slate-300 mb-2">folder_open</span>
                  <p className="text-sm text-slate-500">No documents uploaded yet.</p>
                </div>
              )}

              {/* Document Upload Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h5 className="text-sm font-bold text-slate-800 mb-4">Upload New Document</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1.5">
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
                </div>

                {/* Drag and drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`cursor-pointer flex flex-col items-center justify-center gap-2 text-center px-4 py-8 rounded-lg border-2 border-dashed transition-colors ${
                    dragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-white hover:border-indigo-300"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    id="docFileInput"
                    type="file"
                    onChange={(e) => validateAndSetFile(e.target.files?.[0])}
                    className="hidden"
                    accept={ALLOWED_DOC_TYPES.join(",")}
                  />
                  {docFile ? (
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-rounded text-indigo-500 text-2xl">
                        {DOC_ICON_BY_EXT[getExt(docFile.name)] || "description"}
                      </span>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800">{docFile.name}</p>
                        <p className="text-xs text-slate-500">{formatBytes(docFile.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Remove file"
                      >
                        <span className="material-symbols-rounded text-lg">close</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-rounded text-3xl text-slate-400">upload_file</span>
                      <p className="text-sm text-slate-600">
                        <span className="font-bold text-indigo-600">Click to browse</span> or drag a file here
                      </p>
                      <p className="text-xs text-slate-400">
                        {ALLOWED_DOC_TYPES.join(", ")} · up to {MAX_DOC_SIZE_MB}MB
                      </p>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleUploadDocument}
                  disabled={uploadingDoc || !docFile || !docType}
                  className={`mt-4 w-full md:w-auto px-6 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-lg shadow-md hover:bg-slate-900 transition-all flex items-center justify-center gap-2 ${
                    uploadingDoc || !docFile || !docType ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploadingDoc ? (
                    <span className="material-symbols-rounded animate-spin text-[18px]">sync</span>
                  ) : (
                    <span className="material-symbols-rounded text-[18px]">upload</span>
                  )}
                  {uploadingDoc ? "Uploading..." : "Upload Document"}
                </button>
              </div>
            </section>
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-end gap-3">
            {isDirty && (
              <span className="sm:mr-auto text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <span className="material-symbols-rounded text-sm">info</span>
                You have unsaved changes
              </span>
            )}
            <button
              type="submit"
              disabled={saving || !isDirty}
              className={`px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2 ${
                saving || !isDirty ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
              {previewDoc.type === "pdf" ? (
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
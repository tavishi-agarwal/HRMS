"use client";

import { useCallback, useEffect, useState } from "react";
import claimService from "@/services/claims.service";
const CLAIM_TYPES = [
  "Travel Reimbursement",
  "Medical Reimbursement",
  "Food Expense",
  "Accommodation",
  "Office Supplies",
  "Other",
];

const initialFormData = {
  requestType: "",
  amount: "",
  description: "",
};

export default function ClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await claimService.getMyClaims();
      setClaims(data);
    } catch (err) {
      console.error("Failed to fetch claims:", err);
      setError("Unable to load your claims. Please try again.");
      setClaims([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    if (!formData.requestType.trim()) {
      return "Please select a claim type.";
    }

    const amount = Number(formData.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return "Please enter a valid amount greater than zero.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccessMessage("");

      await claimService.createClaim(formData);

      setFormData(initialFormData);
      setSuccessMessage("Claim submitted successfully.");

      await fetchClaims();
    } catch (err) {
      console.error("Failed to create claim:", err);
      setError(
        err?.message || "Unable to submit your claim. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatAmount = (amount) => {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount)) {
      return "—";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(numericAmount);
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  };

  const getStatusClasses = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";

      case "PENDING":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Claims</h1>
        <p className="mt-1 text-sm text-slate-500">
          Submit reimbursement requests and track their status.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Submit New Claim
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the reimbursement details below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="requestType"
                className="text-sm font-semibold text-slate-700"
              >
                Claim Type
              </label>

              <select
                id="requestType"
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                disabled={submitting}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Select claim type</option>

                {CLAIM_TYPES.map((claimType) => (
                  <option key={claimType} value={claimType}>
                    {claimType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="text-sm font-semibold text-slate-700"
              >
                Amount
              </label>

              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  ₹
                </span>

                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  disabled={submitting}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-8 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                disabled={submitting}
                maxLength={500}
                placeholder="Add any useful details about this claim..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {formData.description.length}/500
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Claim"}
            </button>
          </form>
        </section>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Claims</h2>
              <p className="mt-1 text-sm text-slate-500">
                Review your previously submitted claims.
              </p>
            </div>

            {!loading && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {claims.length} {claims.length === 1 ? "claim" : "claims"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4 p-6 animate-pulse">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : claims.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <span className="text-2xl">₹</span>
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                No claims submitted
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Your submitted reimbursement claims will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Type
                    </th>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {claims.map((claim) => (
                    <tr
                      key={claim.id}
                      className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        {claim.referenceNo || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-slate-900">
                          {claim.requestType || "—"}
                        </p>

                        {claim.description && (
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                            {claim.description}
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(claim.requestedOn)}
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {formatAmount(claim.amount)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${getStatusClasses(
                            claim.status
                          )}`}
                        >
                          {claim.status || "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
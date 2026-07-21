"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import claimService from "@/services/claims.service";

const badgeStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
  "In Review": "bg-indigo-100 text-indigo-700",
};

const dotStyles = {
  Pending: "bg-amber-600",
  Approved: "bg-indigo-500",
  Rejected: "bg-rose-500",
  "In Review": "bg-amber-600",
};

function extractData(response) {
  const data = response?.data ?? response ?? [];

  // Supports a normal array response.
  if (Array.isArray(data)) {
    return data;
  }

  // Supports Spring Page response.
  if (Array.isArray(data?.content)) {
    return data.content;
  }

  return [];
}

function normalizeStatus(value) {
  if (!value) return "Pending";

  const status = String(value)
    .trim()
    .toUpperCase()
    .replaceAll("_", " ");

  const statusMap = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    "IN REVIEW": "In Review",
    REVIEW: "In Review",
    "UNDER REVIEW": "In Review",
  };

  return statusMap[status] || value;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getReferenceNumber(claim) {
  if (claim.referenceNumber) return claim.referenceNumber;
  if (claim.referenceNo) return claim.referenceNo;
  if (claim.claimNumber) return claim.claimNumber;

  if (claim.id !== null && claim.id !== undefined) {
    return `CLM-${String(claim.id).padStart(6, "0")}`;
  }

  return "—";
}

function mapClaimToRow(claim) {
  const status = normalizeStatus(claim.status);

  return {
    id: claim.id ?? getReferenceNumber(claim),
    type:
      claim.requestType ||
      claim.claimType ||
      claim.type ||
      "Claim Request",
    ref: getReferenceNumber(claim),
    date: formatDate(
      claim.createdAt ||
        claim.requestedOn ||
        claim.requestDate ||
        claim.createdDate ||
        claim.date
    ),
    status,
  };
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unable to load claim status."
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${
        badgeStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function LoadingRows() {
  return Array.from({ length: 4 }).map((_, index) => (
    <tr key={index} className="border-b border-slate-50">
      <td className="px-4 py-4">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-100" />
      </td>

      <td className="px-4 py-4">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
      </td>

      <td className="px-4 py-4">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
      </td>

      <td className="px-4 py-4">
        <div className="ml-auto h-6 w-20 animate-pulse rounded-full bg-slate-100" />
      </td>
    </tr>
  ));
}

export default function StatusTracker() {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClaims() {
      try {
        setLoading(true);
        setError("");

        const response = await claimService.getMyClaims();
        const claims = extractData(response);

        const rows = claims
          .map(mapClaimToRow)
          .sort((first, second) => {
            const firstId = Number(first.id) || 0;
            const secondId = Number(second.id) || 0;

            return secondId - firstId;
          })
          .slice(0, 4);

        setStatusData(rows);
      } catch (err) {
        console.error("Failed to load claims:", err);
        setError(getErrorMessage(err));
        setStatusData([]);
      } finally {
        setLoading(false);
      }
    }

    loadClaims();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="font-bold text-slate-700">Status Tracker</h3>

        <Link
          href="/claims"
          className="text-xs font-bold text-indigo-600 hover:underline"
        >
          See All
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <th className="px-4 pb-4">Request Type</th>
              <th className="px-4 pb-4">Reference No.</th>
              <th className="px-4 pb-4">Requested On</th>
              <th className="px-4 pb-4 text-right">Status</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {loading ? (
              <LoadingRows />
            ) : statusData.length > 0 ? (
              statusData.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-4 py-4 font-bold text-slate-700">
                    <span
                      className={`mr-2 inline-block h-2 w-2 rounded-full ${
                        dotStyles[row.status] || "bg-slate-400"
                      }`}
                    />

                    {row.type}
                  </td>

                  <td className="px-4 py-4 text-slate-500">
                    {row.ref}
                  </td>

                  <td className="px-4 py-4 text-slate-500">
                    {row.date}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center">
                  <span className="material-symbols-rounded text-4xl text-slate-300">
                    receipt_long
                  </span>

                  <p className="mt-2 text-sm font-bold text-slate-600">
                    No claims found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Your submitted claims will appear here.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
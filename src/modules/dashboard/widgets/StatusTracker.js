"use client";

import { useRouter } from "next/navigation";

const statusData = [
  {
    type: "Medical Reimbursement",
    ref: "CLM-2023-9082",
    date: "Oct 20, 2023",
    status: "Pending",
    color: "rose",
  },
  {
    type: "LTA Claim",
    ref: "CLM-2023-8841",
    date: "Oct 15, 2023",
    status: "Approved",
    color: "indigo",
  },
  {
    type: "Remote Work Setup",
    ref: "REQ-2023-1120",
    date: "Oct 12, 2023",
    status: "In Review",
    color: "amber",
  },
  {
    type: "Travel Claim",
    ref: "REQ-2023-1123",
    date: "Oct 12, 2023",
    status: "In Review",
    color: "amber",
  },
];

const badgeStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  "In Review": "bg-indigo-100 text-indigo-700",
};

const dotStyles = {
  rose: "bg-rose-500",
  indigo: "bg-indigo-500",
  amber: "bg-amber-600",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${
        badgeStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function StatusTracker() {
  const router = useRouter();

  function handleRowClick(row) {
    if (row.ref.startsWith("CLM")) {
      router.push(`/claims?ref=${encodeURIComponent(row.ref)}`);
      return;
    }

    router.push(`/claims?ref=${encodeURIComponent(row.ref)}`);
  }

  return (
    <section className="rounded-3xl border border-indigo-50/60 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <span className="material-symbols-rounded text-[21px]">
              folder_open
            </span>
          </div>

          <div>
            <h3 className="text-sm font-black text-slate-800">
              Status Tracker
            </h3>
            <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
              Recent claims and requests
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/claims")}
          className="text-xs font-black text-indigo-600 transition hover:text-indigo-700 hover:underline"
        >
          See All
        </button>
      </div>

      <div className="w-full">
        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:text-[10px]">
              <th className="w-[42%] px-2 pb-3 sm:px-4 sm:pb-4">
                Request Type
              </th>

              <th className="w-[22%] px-2 pb-3 sm:px-4 sm:pb-4">
                Reference No.
              </th>

              <th className="w-[19%] px-2 pb-3 sm:px-4 sm:pb-4">
                Requested On
              </th>

              <th className="w-[17%] px-2 pb-3 text-right sm:px-4 sm:pb-4">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="text-xs sm:text-sm">
            {statusData.map((row) => (
              <tr
                key={row.ref}
                onClick={() => handleRowClick(row)}
                tabIndex={0}
                role="button"
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    handleRowClick(row);
                  }
                }}
                className="cursor-pointer border-b border-slate-50 transition-colors last:border-b-0 hover:bg-slate-50/70 focus:bg-slate-50/70 focus:outline-none"
              >
                <td className="px-2 py-4 font-bold text-slate-700 sm:px-4">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        dotStyles[row.color] || "bg-slate-400"
                      }`}
                    />

                    <span className="truncate">{row.type}</span>
                  </div>
                </td>

                <td className="truncate px-2 py-4 text-[11px] font-semibold text-slate-500 sm:px-4 sm:text-xs">
                  {row.ref}
                </td>

                <td className="truncate px-2 py-4 text-[11px] text-slate-500 sm:px-4 sm:text-xs">
                  {row.date}
                </td>

                <td className="px-2 py-4 text-right sm:px-4">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
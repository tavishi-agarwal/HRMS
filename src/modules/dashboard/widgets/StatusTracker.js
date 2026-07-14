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
      className={`px-3 py-1 text-[10px] font-extrabold rounded-full uppercase ${
        badgeStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function StatusTracker() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-slate-700">Status Tracker</h3>
        <button className="text-xs font-bold text-indigo-600">See All</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50">
              <th className="pb-4 px-4">Request Type</th>
              <th className="pb-4 px-4">Reference No.</th>
              <th className="pb-4 px-4">Requested On</th>
              <th className="pb-4 px-4 text-right">Status</th>
            </tr>
          </thead>

          <tbody className="text-sm">
            {statusData.map((row) => (
              <tr
                key={row.ref}
                className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-4 px-4 font-bold text-slate-700">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${dotStyles[row.color] || "bg-slate-400"}`}
                  />
                  {row.type}
                </td>
                <td className="py-4 px-4 text-slate-500">{row.ref}</td>
                <td className="py-4 px-4 text-slate-500">{row.date}</td>
                <td className="py-4 px-4 text-right">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

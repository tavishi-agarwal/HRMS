"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllEmployees } from "@/services/employee.service";

export default function EmployeeList({ 
  title = "Employees", 
  description = "Manage all employee records",
  buttonText = "Add Employee" 
}) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchEmployees(page, size);
  }, [page, size]);

  const fetchEmployees = async (currentPage, currentSize) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllEmployees(currentPage, currentSize);
      if (response && response.content !== undefined) {
        setEmployees(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        setError("Failed to fetch employee list format");
      }
    } catch (err) {
      setError("An error occurred while fetching employees");
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <Link
          href="/employees/add"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <span className="material-symbols-rounded text-[18px]">person_add</span>
          {buttonText}
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center gap-3">
          <span className="material-symbols-rounded">error</span>
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p>Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-rounded text-slate-300 text-5xl">groups</span>
            <p className="text-slate-500 mt-3 font-medium">No employees found in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-6 py-4">Employee Code</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id || emp.employeeCode} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{emp.employeeCode || "N/A"}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {emp.firstName?.charAt(0) || "U"}
                      </div>
                      <span className="font-semibold text-slate-800">{emp.firstName} {emp.lastName}</span>
                    </td>
                    <td className="px-6 py-4">{emp.email || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                        {emp.department || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{emp.designation || "N/A"}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1" title="View Profile">
                        <span className="material-symbols-rounded text-[20px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && employees.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">
              Showing page {page + 1} of {totalPages} ({totalElements} total records)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={page === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

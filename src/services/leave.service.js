import apiGet from "@/lib/api/apiGet";
import apiPost from "@/lib/api/apiPost";
import apiPut from "@/lib/api/apiPut";
import { ENDPOINTS } from "@/constants/endpoints";

/**
 * Get current user's leave applications
 */
export const getMyLeaves = async () => {
  return await apiGet(ENDPOINTS.LEAVE.MY_LEAVES);
};

/**
 * Get current user's leave balances
 */
export const getMyBalances = async () => {
  return await apiGet(ENDPOINTS.LEAVE.MY_BALANCES);
};

/**
 * Apply for leave
 * @param {{ leaveType, startDate, endDate, reason }} dto
 */
export const applyLeave = async (dto) => {
  return await apiPost(ENDPOINTS.LEAVE.APPLY, dto);
};

/**
 * Get pending leaves (for HR/TL)
 */
export const getPendingLeaves = async () => {
  return await apiGet(ENDPOINTS.LEAVE.PENDING);
};

/**
 * Get all leaves (for HR/Admin/TL)
 */
export const getAllLeaves = async (page = 0, size = 10) => {
  return await apiGet(`${ENDPOINTS.LEAVE.ALL}?page=${page}&size=${size}`);
};

/**
 * Approve a leave by ID (HR/TL only)
 */
export const approveLeave = async (id) => {
  return await apiPut(ENDPOINTS.LEAVE.APPROVE(id));
};

/**
 * Reject a leave by ID (HR/TL only)
 */
export const rejectLeave = async (id) => {
  return await apiPut(ENDPOINTS.LEAVE.REJECT(id));
};

/**
 * Get all leave policies (for HR/Admin)
 */
export const getAllPolicies = async () => {
  return await apiGet(ENDPOINTS.LEAVE_POLICY.ALL);
};

/**
 * Update a leave policy by type (for HR/Admin)
 */
export const updatePolicy = async (type, defaultAllowed) => {
  return await apiPut(ENDPOINTS.LEAVE_POLICY.UPDATE(type), { leaveType: type, defaultAllowed });
};

/**
 * Get overall leave stats (for HR/Admin)
 */
export const getLeaveStats = async () => {
  return await apiGet(ENDPOINTS.LEAVE.STATS);
};

export default {
  getMyLeaves,
  getMyBalances,
  applyLeave,
  getPendingLeaves,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  getAllPolicies,
  updatePolicy,
  getLeaveStats,
};

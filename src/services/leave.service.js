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

export default {
  getMyLeaves,
  getMyBalances,
  applyLeave,
  getPendingLeaves,
  approveLeave,
  rejectLeave,
};

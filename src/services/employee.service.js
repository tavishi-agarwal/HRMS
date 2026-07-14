import apiGet from "@/lib/api/apiGet";
import apiPost from "@/lib/api/apiPost";
import { ENDPOINTS } from "@/constants/endpoints";

/**
 * Creates a new employee
 * @param {Object} employeeData 
 * @returns {Promise<Object>}
 */
export const createEmployee = async (employeeData) => {
  return await apiPost(ENDPOINTS.EMPLOYEES.CREATE, employeeData);
};

/**
 * Fetches all employees (paginated)
 * @param {number} page 
 * @param {number} size 
 * @returns {Promise<Object>}
 */
export const getAllEmployees = async (page = 0, size = 10) => {
  return await apiGet(ENDPOINTS.EMPLOYEES.LIST, { page, size });
};

export default {
  createEmployee,
  getAllEmployees,
};

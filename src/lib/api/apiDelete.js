/**
 * ============================================================
 *  apiDelete.js — DELETE Request Utility
 * ============================================================
 *  Usage:
 *    import apiDelete from '@/lib/api/apiDelete'
 *    import { ENDPOINTS } from '@/constants/endpoints'
 *
 *    // Delete employee
 *    await apiDelete(ENDPOINTS.EMPLOYEES.DELETE(5))
 *
 *    // Delete with query params
 *    await apiDelete(ENDPOINTS.USERS.DELETE(12), { reason: 'Resigned' })
 *
 *  On success: Returns response data
 *  On error:   Logs and throws (lets caller handle it)
 * ============================================================
 */

import httpClient from '@/lib/httpClient';

export const apiDelete = async (url = '', params = {}) => {
  try {
    const config = {};

    if (typeof params === 'object' && params !== null && Object.keys(params).length > 0) {
      config.params = params;
    }

    const response = await httpClient.delete(url, config);
    return response.data;
  } catch (error) {
    console.error(`[API DELETE Error] ${url}:`, error?.response?.data || error.message);
    throw error; // Throw so caller can show error toast/message
  }
};

export default apiDelete;

/**
 * ============================================================
 *  apiPut.js — PUT Request Utility (Full Update)
 * ============================================================
 *  Usage:
 *    import apiPut from '@/lib/api/apiPut'
 *    import { ENDPOINTS } from '@/constants/endpoints'
 *
 *    // Update employee
 *    const res = await apiPut(ENDPOINTS.EMPLOYEES.UPDATE(5), { name: 'Rahul', dept: 'HR' })
 *
 *    // Approve leave
 *    const res = await apiPut(ENDPOINTS.LEAVE.APPROVE(12), { comments: 'Approved' })
 *
 *  On success: Returns response data
 *  On error:   Returns { success: false, status, message, error }
 * ============================================================
 */

import httpClient from '@/lib/httpClient';

export const apiPut = async (
  endpoint,
  data         = {},
  isJson       = true,
  extraHeaders = {}
) => {
  try {
    const config = {
      headers: {
        Accept: 'application/json',
        ...extraHeaders,
      },
    };

    if (isJson) {
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await httpClient.put(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`[API PUT Error] ${endpoint}:`, error?.response?.data || error.message);

    if (error.response) {
      return {
        success: false,
        status:  error.response.status,
        message: error.response.data?.message || error.response.data?.description || 'API Error',
        error:   error.response.data,
      };
    }

    return {
      success: false,
      message: error.message || 'Network Error',
    };
  }
};

export default apiPut;

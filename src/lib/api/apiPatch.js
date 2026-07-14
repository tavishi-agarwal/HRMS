/**
 * ============================================================
 *  apiPatch.js — PATCH Request Utility (Partial Update)
 * ============================================================
 *  Use PATCH when updating only SOME fields (not the whole record).
 *  Use PUT when replacing the entire record.
 *
 *  Usage:
 *    import apiPatch from '@/lib/api/apiPatch'
 *    import { ENDPOINTS } from '@/constants/endpoints'
 *
 *    // Update only the role
 *    const res = await apiPatch(ENDPOINTS.USERS.CHANGE_ROLE(5), { role: 'HR' })
 *
 *    // Mark notification as read
 *    const res = await apiPatch(ENDPOINTS.NOTIFICATIONS.MARK_READ(notifId))
 *
 *  On success: Returns response data
 *  On error:   Returns { success: false, status, message, error }
 * ============================================================
 */

import httpClient from '@/lib/httpClient';

export const apiPatch = async (
  endpoint,
  data         = {},
  extraHeaders = {}
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...extraHeaders,
      },
    };

    const response = await httpClient.patch(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`[API PATCH Error] ${endpoint}:`, error?.response?.data || error.message);

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

export default apiPatch;

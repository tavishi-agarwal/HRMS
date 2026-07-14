/**
 * ============================================================
 *  apiPost.js — POST Request Utility
 * ============================================================
 *  Usage:
 *    import apiPost from '@/lib/api/apiPost'
 *    import { ENDPOINTS } from '@/constants/endpoints'
 *
 *    // Login (no auth token needed)
 *    const res = await apiPost(ENDPOINTS.AUTH.LOGIN, { email, password }, true, {}, false)
 *
 *    // Apply leave
 *    const res = await apiPost(ENDPOINTS.LEAVE.APPLY, { days: 3, reason: '...' })
 *
 *    // Submit claim
 *    const res = await apiPost(ENDPOINTS.CLAIMS.SUBMIT, formData)
 *
 *  On success: Returns response data
 *  On error:   Returns { success: false, status, message, error }
 * ============================================================
 */

import httpClient from '@/lib/httpClient';

export const apiPost = async (
  endpoint,
  data        = {},
  isJson      = true,
  extraHeaders = {},
  sendAuth    = true
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

    // skipAuth flag is read by httpClient request interceptor
    if (!sendAuth) {
      config.skipAuth = true;
    }

    const response = await httpClient.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    console.error(`[API POST Error] ${endpoint}:`, error?.response?.data || error.message);

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

export default apiPost;

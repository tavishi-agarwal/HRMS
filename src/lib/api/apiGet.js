/**
 * ============================================================
 *  apiGet.js — GET Request Utility
 * ============================================================
 *  Usage:
 *    import apiGet from '@/lib/api/apiGet'
 *    import { ENDPOINTS } from '@/constants/endpoints'
 *
 *    // Simple GET
 *    const data = await apiGet(ENDPOINTS.EMPLOYEES.LIST)
 *
 *    // GET with query params (page, filters etc.)
 *    const data = await apiGet(ENDPOINTS.EMPLOYEES.LIST, { page: 1, size: 10 })
 *
 *    // GET single item by ID
 *    const emp = await apiGet(ENDPOINTS.EMPLOYEES.GET(5))
 *
 *  On error: logs and returns null (no app crash)
 * ============================================================
 */

import httpClient from '@/lib/httpClient';

export const apiGet = async (url = '', params = {}) => {
  try {
    const config = {};

    // If params is an object with keys, attach as query params
    if (typeof params === 'object' && params !== null && Object.keys(params).length > 0) {
      config.params = params;
    }

    const response = await httpClient.get(url, config);
    return response.data;
  } catch (error) {
    console.error(`[API GET Error] ${url}:`, error?.response?.data || error.message);
    return null; // Returns null on failure — prevents app crash
  }
};

export default apiGet;

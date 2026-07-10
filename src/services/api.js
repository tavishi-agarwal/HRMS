import axiosInstance from "@/lib/axios";

/**
 * api.js — Universal API Helper
 * ==============================
 * GET, POST, PUT, PATCH, DELETE ke liye ready-made functions.
 * Baar baar axiosInstance.get(...) likhne ki zaroorat nahi.
 *
 * Usage example:
 *   import api from "@/services/api"
 *   import { ENDPOINTS } from "@/constants/endpoints"
 *
 *   const data = await api.get(ENDPOINTS.EMPLOYEES.LIST)
 *   const emp  = await api.get(ENDPOINTS.EMPLOYEES.GET(5))
 *   const res  = await api.post(ENDPOINTS.LEAVE.APPLY, { days: 3 })
 *   await api.put(ENDPOINTS.PROFILE.UPDATE, { name: "Rahul" })
 *   await api.del(ENDPOINTS.EMPLOYEES.DELETE(12))
 */

const api = {

  /**
   * GET request
   * @param {string} url - endpoint URL
   * @param {object} params - query params (optional) e.g. { page: 1, size: 10 }
   * @returns {Promise<any>} response data
   */
  get: async (url, params = {}) => {
    const response = await axiosInstance.get(url, { params });
    return response.data;
  },

  /**
   * POST request
   * @param {string} url - endpoint URL
   * @param {object} body - request body
   * @returns {Promise<any>} response data
   */
  post: async (url, body = {}) => {
    const response = await axiosInstance.post(url, body);
    return response.data;
  },

  /**
   * PUT request (full update)
   * @param {string} url - endpoint URL
   * @param {object} body - request body
   * @returns {Promise<any>} response data
   */
  put: async (url, body = {}) => {
    const response = await axiosInstance.put(url, body);
    return response.data;
  },

  /**
   * PATCH request (partial update)
   * @param {string} url - endpoint URL
   * @param {object} body - fields to update
   * @returns {Promise<any>} response data
   */
  patch: async (url, body = {}) => {
    const response = await axiosInstance.patch(url, body);
    return response.data;
  },

  /**
   * DELETE request
   * @param {string} url - endpoint URL
   * @returns {Promise<any>} response data
   */
  del: async (url) => {
    const response = await axiosInstance.delete(url);
    return response.data;
  },

  /**
   * File upload (multipart/form-data)
   * @param {string} url - endpoint URL
   * @param {FormData} formData - FormData object with files
   * @returns {Promise<any>} response data
   */
  upload: async (url, formData) => {
    const response = await axiosInstance.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * Download file (blob response)
   * @param {string} url - endpoint URL
   * @param {string} filename - name to save file as
   */
  download: async (url, filename = "download") => {
    const response = await axiosInstance.get(url, { responseType: "blob" });
    const blob = new Blob([response.data]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  },

};

export default api;

/**
 * ============================================================
 *  apiMultipart.js — File Upload Utility (multipart/form-data)
 * ============================================================
 *  Use when uploading files (profile photo, documents, etc.)
 *
 *  Usage:
 *    import apiMultipart from '@/lib/api/apiMultipart'
 *    import { ENDPOINTS } from '@/constants/endpoints'
 *
 *    // Upload profile photo
 *    const formData = new FormData()
 *    formData.append('avatar', file)
 *    const res = await apiMultipart(ENDPOINTS.PROFILE.UPLOAD_AVATAR, formData)
 *
 *    // Upload claim document
 *    const formData = new FormData()
 *    formData.append('document', file)
 *    formData.append('claimId', '123')
 *    const res = await apiMultipart(ENDPOINTS.CLAIMS.SUBMIT, formData)
 *
 *  On error: Logs and throws
 * ============================================================
 */

import httpClient from '@/lib/httpClient';

export const apiMultipart = async (url, formData) => {
  try {
    const response = await httpClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`[API MULTIPART Error] ${url}:`, error?.response?.data || error.message);
    throw error;
  }
};

export default apiMultipart;

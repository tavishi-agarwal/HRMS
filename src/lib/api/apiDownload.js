/**
 * ============================================================
 *  apiDownload.js — File Download Utility (blob response)
 * ============================================================
 *  Use when downloading files (payslips, reports, etc.)
 *
 *  Usage:
 *    import apiDownload from '@/lib/api/apiDownload'
 *    import { ENDPOINTS } from '@/constants/endpoints'
 *
 *    // Download payslip PDF
 *    await apiDownload(ENDPOINTS.PAYROLL.DOWNLOAD(payslipId), 'payslip-oct-2024.pdf')
 *
 *    // Download attendance report
 *    await apiDownload(ENDPOINTS.REPORTS.DOWNLOAD(reportId), 'attendance-report.xlsx')
 *
 *  On error: Logs and throws
 * ============================================================
 */

import httpClient from '@/lib/httpClient';

export const apiDownload = async (url, filename = 'download') => {
  try {
    const response = await httpClient.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href  = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    return true;
  } catch (error) {
    console.error(`[API DOWNLOAD Error] ${url}:`, error?.response?.data || error.message);
    throw error;
  }
};

export const apiPreview = async (url, filename = '') => {
  try {
    const response = await httpClient.get(url, {
      responseType: 'blob',
    });

    // Guess content type from filename if header is missing
    let contentType = response.headers['content-type'];
    if (!contentType || contentType === 'application/octet-stream') {
      const ext = filename.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg'].includes(ext)) contentType = 'image/jpeg';
      else if (ext === 'png') contentType = 'image/png';
      else if (ext === 'pdf') contentType = 'application/pdf';
      else contentType = 'application/pdf'; // fallback
    }

    const blob = new Blob([response.data], { type: contentType });
    const blobUrl = URL.createObjectURL(blob);
    
    return blobUrl;
  } catch (error) {
    console.error(`[API PREVIEW Error] ${url}:`, error?.response?.data || error.message);
    throw error;
  }
};

export default apiDownload;

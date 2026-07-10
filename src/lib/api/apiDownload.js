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

export default apiDownload;

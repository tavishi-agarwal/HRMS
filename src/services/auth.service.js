import apiGet  from '@/lib/api/apiGet';
import apiPost from '@/lib/api/apiPost';
import { ENDPOINTS } from '@/constants/endpoints';
import { setToken, setRefreshToken, setUserInfo, clearTokens } from '@/lib/tokenManager';

/**
 * auth.service.js — Authentication API calls
 * ============================================
 * Usage in component:
 *   import authService from "@/services/auth.service"
 *   const result = await authService.login({ email, password })
 */

const authService = {

  /**
   * Login
   * @param {{ email: string, password: string }} credentials
   */
  login: async ({ email, password }) => {
    // sendAuth = false → no token sent for login request
    const data = await apiPost(ENDPOINTS.AUTH.LOGIN, { email, password }, true, {}, false);

    if (data && !data?.success === false) {
      if (data?.accessToken)  setToken(data.accessToken);
      if (data?.refreshToken) setRefreshToken(data.refreshToken);
      if (data?.user)         setUserInfo(data.user);
    }

    return data;
  },

  /**
   * Logout — clear tokens and call backend
   */
  logout: async () => {
    try {
      await apiPost(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      clearTokens();
    }
  },

  /**
   * Get currently logged-in user
   */
  getMe: async () => {
    return await apiGet(ENDPOINTS.AUTH.ME);
  },

  /**
   * Forgot password
   * @param {{ email: string }} payload
   */
  forgotPassword: async ({ email }) => {
    return await apiPost(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, true, {}, false);
  },

  /**
   * Verify OTP
   * @param {{ otp: string, email: string }} payload
   */
  verifyOtp: async ({ otp, email }) => {
    return await apiPost(ENDPOINTS.AUTH.VERIFY_OTP, { otp, email }, true, {}, false);
  },

  /**
   * Reset Password
   * @param {{ token: string, newPassword: string }} payload
   */
  resetPassword: async ({ token, newPassword }) => {
    return await apiPost(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword }, true, {}, false);
  },

};

export default authService;

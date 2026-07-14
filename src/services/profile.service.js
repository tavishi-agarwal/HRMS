import apiGet from "@/lib/api/apiGet";
import apiPost from "@/lib/api/apiPost";
import { ENDPOINTS } from "@/constants/endpoints";

/**
 * Service for Employee Profile API calls
 */
const profileService = {
  /**
   * Get employee profile by user ID
   * @param {number|string} userId
   */
  getProfileByUserId: async (userId) => {
    try {
      const data = await apiGet(ENDPOINTS.EMPLOYEES.PROFILE(userId));
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  /**
   * Save or update employee profile
   * @param {number|string} userId
   * @param {Object} employeeData
   */
  saveOrUpdateProfile: async (userId, employeeData) => {
    try {
      // Assuming apiPost handles POST method. For update it might be PUT, but controller says @PostMapping
      const data = await apiPost(ENDPOINTS.EMPLOYEES.PROFILE(userId), employeeData);
      return data;
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  },
};

export default profileService;

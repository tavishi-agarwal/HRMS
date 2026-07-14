import apiGet from "@/lib/api/apiGet";
import apiPost from "@/lib/api/apiPost";
import { ENDPOINTS } from "@/constants/endpoints";
import { getToken } from "@/lib/tokenManager";

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

  /**
   * Upload an employee document
   * @param {number|string} employeeId
   * @param {string} documentType
   * @param {File} file
   */
  uploadDocument: async (employeeId, documentType, file) => {
    try {
      const formData = new FormData();
      formData.append("documentType", documentType);
      formData.append("file", file);
      
      // We need to use fetch or a customized axios instance for multipart/form-data
      // But standard apiPost might handle FormData if configured, else we do it here
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${ENDPOINTS.EMPLOYEES.UPLOAD_DOCUMENT(employeeId)}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) throw new Error("Upload failed");
      return await res.json();
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  },
};

export default profileService;

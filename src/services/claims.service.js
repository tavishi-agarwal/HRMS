import apiGet from "@/lib/api/apiGet";
import apiPost from "@/lib/api/apiPost";
import { ENDPOINTS } from "@/constants/endpoints";

/**
 * Service for employee claim API calls.
 */
const claimService = {
  /**
   * Get all claims submitted by the currently authenticated employee.
   *
   * The backend identifies the employee using the authentication token,
   * so a user ID is not required.
   *
   * @returns {Promise<Array>}
   */
  getMyClaims: async () => {
    try {
      const data = await apiGet(ENDPOINTS.CLAIMS.BASE);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching claims:", error);
      throw error;
    }
  },

  /**
   * Create a new claim for the currently authenticated employee.
   *
   * @param {Object} claimData
   * @param {string} claimData.requestType
   * @param {number|string} claimData.amount
   * @param {string} [claimData.description]
   * @returns {Promise<Object>}
   */
  createClaim: async (claimData) => {
    try {
      const requestType = claimData?.requestType?.trim();
      const amount = Number(claimData?.amount);
      const description = claimData?.description?.trim() || "";

      if (!requestType) {
        throw new Error("Claim request type is required.");
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Claim amount must be greater than zero.");
      }

      const payload = {
        requestType,
        amount,
        description,
      };

      return await apiPost(ENDPOINTS.CLAIMS.BASE, payload);
    } catch (error) {
      console.error("Error creating claim:", error);
      throw error;
    }
  },
};

export default claimService;
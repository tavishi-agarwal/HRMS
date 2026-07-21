import apiGet from "@/lib/api/apiGet";
import apiPost from "@/lib/api/apiPost";
import { ENDPOINTS } from "@/constants/endpoints";

const attendanceService = {
  getTodayAttendance() {
    return apiGet(ENDPOINTS.ATTENDANCE.TODAY);
  },

  punchIn() {
    return apiPost(ENDPOINTS.ATTENDANCE.PUNCH_IN, {});
  },

  punchOut() {
    return apiPost(ENDPOINTS.ATTENDANCE.PUNCH_OUT, {});
  },

  getAnnualAttendance(year, page = 0, size = 10) {
    return apiGet(
      `${ENDPOINTS.ATTENDANCE.ANNUAL}?year=${year}&page=${page}&size=${size}`
    );
  },

  getAttendanceByDateRange(startDate, endDate) {
    return apiGet(
      `${ENDPOINTS.ATTENDANCE.RANGE}?startDate=${startDate}&endDate=${endDate}`
    );
  },
};

export default attendanceService;
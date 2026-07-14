import apiGet from "@/lib/api/apiGet";
import apiPost from "@/lib/api/apiPost";
import apiPut from "@/lib/api/apiPut";
import apiDelete from "@/lib/api/apiDelete";
import { ENDPOINTS } from "@/constants/endpoints";

export const getAllHolidays = async () => {
  return await apiGet(ENDPOINTS.HOLIDAY.ALL);
};

export const getUpcomingHolidays = async () => {
  return await apiGet(ENDPOINTS.HOLIDAY.UPCOMING);
};

export const createHoliday = async (dto) => {
  return await apiPost(ENDPOINTS.HOLIDAY.CREATE, dto);
};

export const updateHoliday = async (id, dto) => {
  return await apiPut(ENDPOINTS.HOLIDAY.UPDATE(id), dto);
};

export const deleteHoliday = async (id) => {
  return await apiDelete(ENDPOINTS.HOLIDAY.DELETE(id));
};

export default {
  getAllHolidays,
  getUpcomingHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
};

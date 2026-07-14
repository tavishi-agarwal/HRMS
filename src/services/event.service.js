import apiGet from "@/lib/api/apiGet";
import apiPost from "@/lib/api/apiPost";
import apiPut from "@/lib/api/apiPut";
import apiDelete from "@/lib/api/apiDelete";
import { ENDPOINTS } from "@/constants/endpoints";

export const getUpcomingEvents = async () => {
  return await apiGet(ENDPOINTS.EVENTS.UPCOMING);
};

export const createEvent = async (data) => {
  return await apiPost(ENDPOINTS.EVENTS.CREATE, data);
};

export const updateEvent = async (id, data) => {
  return await apiPut(ENDPOINTS.EVENTS.UPDATE(id), data);
};

export const deleteEvent = async (id) => {
  return await apiDelete(ENDPOINTS.EVENTS.DELETE(id));
};

export default {
  getUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};

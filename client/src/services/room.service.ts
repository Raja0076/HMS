import api from "../api/axios";

export const getAllRooms = (params?: Record<string, unknown>) => api.get("/rooms", { params });

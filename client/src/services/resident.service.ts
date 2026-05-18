import api from "../api/axios";

export const getAllResidents = (params?: Record<string, unknown>) => api.get("/residents", { params });

import api from "../api/axios";

export const getAllUsers = (params?: Record<string, unknown>) => api.get("/users", { params });
export const createUser = (data: Record<string, unknown>) => api.post("/users", data);
export const updateUser = (userId: string, data: Record<string, unknown>) => api.put(`/users/${userId}`, data);

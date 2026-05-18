import api from "../api/axios";

export const getAllBuildings = (params?: Record<string, unknown>) => api.get("/buildings", { params });
export const createBuilding = (data: Record<string, unknown>) => api.post("/buildings", data);
export const getFloorsByBuilding = (buildingId: string) => api.get(`/buildings/${buildingId}/floors`);

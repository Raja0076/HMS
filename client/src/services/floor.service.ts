import api from "../api/axios";

export const getFloorsByBuilding = (buildingId: string) => api.get(`/buildings/${buildingId}/floors`);
export const createFloor = (buildingId: string, data: Record<string, unknown>) => api.post(`/buildings/${buildingId}/floors`, data);

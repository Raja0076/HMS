import api from '../api/axios';

export const login = (data:any) => api.post('/auth/login', data);
export const register = (data:any) => api.post('/auth/register', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

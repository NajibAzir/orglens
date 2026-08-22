import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/orglens-service',
});

export const getDashboardStats = () => api.get('/dashboard/stats');
export const getMovements = (id) => api.get(`/movements/${id}`);
export const getOrgTree = (date) => api.get(`/org-tree?date=${date}`);
export const getRoles = () => api.get('/roles');
export const getRole = (id) => api.get(`/roles/${id}`);
export const getRoleHistory = (id) => api.get(`/role-history/${id}`);
export const getRoleRelevancy = (id) => api.get(`/role-relevancy/${id}`);
export const getRoleRelevancyAll = () => api.get('/role-relevancy');
export const getMacroTrends = () => api.get('/role-relevancy/trends/macro');
export const getUpskillingRecommendations = () => api.get('/upskilling/recommendations');
export const getPersonalUpskilling = (id) => api.get(`/upskilling/personal/${id}`);
export const updateUpskillProgress = (payload) => api.post('/upskilling/progress', payload);
export const getEmployees = () => api.get('/employees');
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const getTicketing = (id) => api.get(`/ticketing/${id}`);
export const getWellbeing = (id) => api.get(`/wellbeing/${id}`);
export const getAllWellbeing = () => api.get('/wellbeing');
export const getDepartments = () => api.get('/departments');
export const getAnomalies = () => api.get('/anomalies');
export const getScenarios = () => api.get('/scenarios');
export const getTicketingEmployees = () => api.get('/ticketing');

// Wallet APIs
export const getWallet = (id) => api.get(`/wallet/${id}`);
export const getWalletTransactions = (id, limit = 20) => api.get(`/wallet/${id}/transactions?limit=${limit}`);
export const makeWalletPayment = (id, payload) => api.post(`/wallet/${id}/pay`, payload);
export const reloadWallet = (payload) => api.post('/wallet/reload', payload);
export const getWalletDashboard = () => api.get('/wallet/dashboard/stats');

export default api;

import axios from 'axios';

// Add token to all requests automatically
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const API_BASE = '';  // Empty string for proxy - will use /api from proxy config

// Medicine APIs
export const medicineAPI = {
  getAll: () => axios.get(`${API_BASE}/api/medicines`),
  getById: (id) => axios.get(`${API_BASE}/api/medicines/${id}`),
  create: (data) => axios.post(`${API_BASE}/api/medicines`, data),
  update: (id, data) => axios.put(`${API_BASE}/api/medicines/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/api/medicines/${id}`),
  search: (query) => axios.get(`${API_BASE}/api/medicines/search?name=${query}`),
};

// Supplier APIs
export const supplierAPI = {
  getAll: () => axios.get(`${API_BASE}/api/suppliers`),
  getById: (id) => axios.get(`${API_BASE}/api/suppliers/${id}`),
  create: (data) => axios.post(`${API_BASE}/api/suppliers`, data),
  update: (id, data) => axios.put(`${API_BASE}/api/suppliers/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/api/suppliers/${id}`),
};

// Customer APIs
export const customerAPI = {
  getAll: () => axios.get(`${API_BASE}/api/customers`),
  getById: (id) => axios.get(`${API_BASE}/api/customers/${id}`),
  create: (data) => axios.post(`${API_BASE}/api/customers`, data),
  update: (id, data) => axios.put(`${API_BASE}/api/customers/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/api/customers/${id}`),
  getWithLoyalty: () => axios.get(`${API_BASE}/api/customers/with-loyalty`),
  addPoints: (id, points) => axios.post(`${API_BASE}/api/customers/${id}/loyalty/${points}`),
};

// Sale APIs
export const saleAPI = {
  getAll: () => axios.get(`${API_BASE}/api/sales`),
  create: (data) => axios.post(`${API_BASE}/api/sales`, data),
  getById: (id) => axios.get(`${API_BASE}/api/sales/${id}`),
  getByCustomer: (customerId) => axios.get(`${API_BASE}/api/sales/customer/${customerId}`),
  getPayments: (saleId) => axios.get(`${API_BASE}/api/sales/${saleId}/payments`),
};

// Purchase Order APIs
export const purchaseAPI = {
  getAll: () => axios.get(`${API_BASE}/api/purchase-orders`),
  getById: (id) => axios.get(`${API_BASE}/api/purchase-orders/${id}`),
  create: (data) => axios.post(`${API_BASE}/api/purchase-orders`, data),
  updateStatus: (id, status) => axios.patch(`${API_BASE}/api/purchase-orders/${id}/status?status=${status}`),
};

// Inventory APIs
export const inventoryAPI = {
  getBatches: (medicineId) => axios.get(`${API_BASE}/api/inventory/medicine/${medicineId}/batches`),
  getExpiringSoon: (days) => axios.get(`${API_BASE}/api/inventory/expiring-soon?days=${days || 30}`),
  getLowStock: (threshold) => axios.get(`${API_BASE}/api/inventory/low-stock?threshold=${threshold || 10}`),
};

// Add this with your other API exports
export const userAPI = {
  getProfile: () => axios.get(`${API_BASE}/api/users/profile`),
  updateProfile: (data) => axios.put(`${API_BASE}/api/users/profile`, data),
  changePassword: (data) => axios.post(`${API_BASE}/api/users/change-password`, data),
  getLoginHistory: () => axios.get(`${API_BASE}/api/users/login-history`),
  updateNotifications: (data) => axios.put(`${API_BASE}/api/users/notifications`, data),
  uploadProfilePic: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE}/api/users/profile-pic`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
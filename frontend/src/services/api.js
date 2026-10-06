import axios from 'axios';
import { downloadCsvReport } from '../utils/exportCsv';

let rawUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
rawUrl = rawUrl.replace(/\/+$/, '');
if (!rawUrl.endsWith('/api')) {
  rawUrl = `${rawUrl}/api`;
}
const API_BASE_URL = rawUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to attach Authorization Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gym_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global 401 unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired credentials if not on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('gym_token');
        localStorage.removeItem('gym_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authAPI = {
  register: (formData) => api.post('/auth/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  login: (credentials) => api.post('/auth/login', credentials),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// User Profile Services
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (formData) => api.put('/user/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => api.put('/user/change-password', data),
};

// Plan Services
export const planAPI = {
  getPublicPlans: () => api.get('/plans'),
  getAdminPlans: () => api.get('/plans/admin'),
  createPlan: (data) => api.post('/plans', data),
  updatePlan: (id, data) => api.put(`/plans/${id}`, data),
  deletePlan: (id) => api.delete(`/plans/${id}`),
};

// Membership Services
export const membershipAPI = {
  getStatus: () => api.get('/membership/status'),
};

// Payment Services
export const paymentAPI = {
  createOrder: (plan_id) => api.post('/payment/create-order', { plan_id }),
  verifyPayment: (paymentData) => api.post('/payment/verify', paymentData),
  getHistory: () => api.get('/payment/history'),
  getInvoiceUrl: (paymentId) => `${API_BASE_URL}/payment/invoice/${paymentId}`,
};

// Admin Services
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getMembers: (params) => api.get('/admin/members', { params }),
  getMemberById: (id) => api.get(`/admin/members/${id}`),
  updateMember: (id, data) => api.put(`/admin/members/${id}`, data),
  updateMemberMembership: (id, data) => api.put(`/admin/members/${id}/membership`, data),
  deleteMember: (id) => api.delete(`/admin/members/${id}`),
  exportMembersCsv: (params) => downloadCsvReport('/admin/members/export', params, 'members_report.csv'),
  getStaffList: () => api.get('/admin/staff'),
  addStaff: (data) => {
    if (data instanceof FormData) {
      return api.post('/admin/staff', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/admin/staff', data);
  },
  updateStaff: (id, data) => api.put(`/admin/staff/${id}`, data),
  deleteStaff: (id) => api.delete(`/admin/staff/${id}`),
  exportStaffCsv: (params) => downloadCsvReport('/admin/staff/export', params, 'staff_report.csv'),
  getPayments: (params) => api.get('/admin/payments', { params }),
  exportPaymentsCsv: (params) => downloadCsvReport('/admin/payments/export', params, 'payments_report.csv'),
  createAnnouncement: (data) => api.post('/admin/announcements', data),
  deleteAnnouncement: (id) => api.delete(`/admin/announcements/${id}`),
};

// Attendance Services
export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance/mark', data),
  getLogs: (params) => api.get('/attendance/logs', { params }),
  exportAttendanceCsv: (params) => downloadCsvReport('/attendance/export', params, 'attendance_report.csv'),
};

// Contact Inquiry Services
export const contactAPI = {
  submitInquiry: (data) => api.post('/inquiries/submit', data),
  getInquiries: (params) => api.get('/inquiries', { params }),
  getStats: () => api.get('/inquiries/stats'),
  updateInquiry: (id, data) => api.put(`/inquiries/${id}`, data),
  assignInquiry: (id, data) => api.put(`/inquiries/${id}/assign`, data),
  deleteInquiry: (id) => api.delete(`/inquiries/${id}`),
};

export default api;

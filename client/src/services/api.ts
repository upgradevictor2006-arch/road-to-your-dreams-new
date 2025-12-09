import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Telegram initData to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.initData) {
      config.headers['x-telegram-init-data'] = tg.initData;
    }
  }
  return config;
});

// Goals API
export const goalsAPI = {
  getAll: () => api.get('/goals'),
  getById: (id: string) => api.get(`/goals/${id}`),
  create: (data: any) => api.post('/goals', data),
  update: (id: string, data: any) => api.put(`/goals/${id}`, data),
  delete: (id: string) => api.delete(`/goals/${id}`),
};

// Users API
export const usersAPI = {
  getMe: () => api.get('/users/me'),
  updateMe: (data: any) => api.put('/users/me', data),
};

// Caravans API
export const caravansAPI = {
  getAll: () => api.get('/caravans'),
  getById: (id: string) => api.get(`/caravans/${id}`),
  create: (data: any) => api.post('/caravans', data),
  update: (id: string, data: any) => api.put(`/caravans/${id}`, data),
  delete: (id: string) => api.delete(`/caravans/${id}`),
};

// AI Assistant API
export const aiAPI = {
  getCheckpointSuggestions: (context: any) => api.post('/ai/suggestions/checkpoints', context),
  getDailyTaskSuggestions: (context: any) => api.post('/ai/suggestions/daily-tasks', context),
  getMotivationalMessage: (context: any, progress: number) => api.post('/ai/motivation', { context, progress }),
  analyzeGoal: (context: any) => api.post('/ai/analyze', context),
  getContextualHelp: (context: any, currentStep: string) => api.post('/ai/help', { context, currentStep }),
};

export default api;


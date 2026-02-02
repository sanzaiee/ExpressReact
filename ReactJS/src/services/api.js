import axios from 'axios';

// Base configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  // headers: {
  //   'Content-Type': 'application/json'
  // }
});

// Request interceptor for JWT
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/me')
};

export const productAPI = {
  getAll: () => API.get('/products'),
  getBySlug: (slug) => API.get(`/products/${slug}`),
  getByCategory: (categoryId) => API.get(`/products?category=${categoryId}`),
  getCategories: () => API.get('/categories'),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`)
};

export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getUserOrders: () => API.get('/orders'),
  getOrder: (id) => API.get(`/orders/${id}`),
  cancelOrder: (id) => API.put(`/orders/${id}/cancel`),
  getAll: () => API.get('/orders/all'),
  updateOrderStatus: (id, data) => API.put(`/orders/${id}/status`, data)
};

export const categoryAPI = {
  getAll: () => API.get('/categories'),
  getBySlug: (slug) => API.get(`/categories/${slug}`),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`)
};

export default API;

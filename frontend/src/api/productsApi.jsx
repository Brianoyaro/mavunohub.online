import apiClient from './apiClient';

// API Service for Products
export const productAPI = {
  // Get all products
  getAllProducts: () => apiClient.get('/api/products'),

  // Get single product
  getProduct: (id) => apiClient.get(`/api/products/${id}`),
};
import apiClient from './apiClient';

// API Service for Products
export const productAPI = {
  // Get all products
  getAllProducts: () => apiClient.get('/products'),

  // Get single product
  getProduct: (id) => apiClient.get(`/products/${id}`),
};
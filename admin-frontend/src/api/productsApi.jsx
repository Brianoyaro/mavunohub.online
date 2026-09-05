import apiClient from './apiClient';

// API Service for Products
export const productAPI = {
  // Get all products
  getAllProducts: () => apiClient.get('/products'),

  // Get single product
  getProduct: (id) => apiClient.get(`/products/${id}`),

  // Create product with images
  createProduct: (productData, images) => {
    const formData = new FormData();
    formData.append('product', JSON.stringify(productData));
    
    images.forEach((image) => {
      formData.append('images', image);
    });

    return apiClient.post('/products', formData);
  },

  // Update product with images
  updateProduct: (id, productData, newImages, imagesToKeep) => {
    const formData = new FormData();
    formData.append('product', JSON.stringify(productData));
    
    // Add only new images
    newImages.forEach((image) => {
      if (image instanceof File) {
        formData.append('images', image);
      }
    });

    // Add images to keep
    formData.append('imagesToKeep', JSON.stringify(imagesToKeep));

    return apiClient.put(`/products/${id}`, formData);
  },

  // Delete product
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
};
const productService = require('../services/productService');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts();
      console.log('Fetched products:', products);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProduct(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      console.log('Fetched product:', product);
      res.json(product);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const productData = JSON.parse(req.body.product);
      console.log('Files received:', req.files);
      console.log('Body received:', req.body);
      const product = await productService.createProduct(productData, req.files);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const productData = JSON.parse(req.body.product);
      console.log('Files received:', req.files);
      console.log('Body received:', req.body);
      const imagesToKeep = req.body.imagesToKeep 
        ? JSON.parse(req.body.imagesToKeep) 
        : [];

      const product = await productService.updateProduct(
        req.params.id,
        productData,
        req.files, //new images
        imagesToKeep, //array of image URLs to keep
      );
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();

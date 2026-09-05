const { getAllProducts } = require('../controllers/productController');
const { Product, ProductImage } = require('../models');
const fileService = require('./fileService');

class ProductService {
    async getAllProducts() {
        const products = await Product.findAll({
        include: [{ model: ProductImage, as: 'images' }],
        });
        return products.map(product => this.normalizeResponseProductData(product.toJSON()));
    }

    async getProductById(id) {
        const productData = await Product.findByPk(id, {
            include: [{ model: ProductImage, as: 'images' }],
        });
        if (!productData) {
            throw new Error('Product not found');
        }
        return this.normalizeResponseProductData(productData.toJSON());
    }

    async createProduct(productData, files) {
        try {
            let furnitureData = productData;

            // furnitureData.price = parseFloat(furnitureData.price); // Ensure price is a number
            // furnitureData.category = furnitureData.category.toUpperCase(); // Ensure category is uppercase
            // furnitureData.type = furnitureData.type.toUpperCase(); // Ensure type is uppercase
            // furnitureData.material = furnitureData.material.toUpperCase(); // Ensure material is uppercase

            furnitureData = this.normalizeReceivedProductData(furnitureData);

            const createdProduct = await Product.create(furnitureData);
            if (files && files.length > 0) {
                const imageUrls = await Promise.all(
                    files.map(async (file) => {
                        const fileUrl = await fileService.saveFile(file);
                        return { imageUrl: fileUrl, productId: createdProduct.id };
                    })
                );
                await ProductImage.bulkCreate(imageUrls);
            }
            let response = await this.getProductById(createdProduct.id);
            response = this.normalizeResponseProductData(response);
            return response;
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }
    
    normalizeReceivedProductData(productData) {
        return {
            ...productData,
            price: parseFloat(productData.price),
            category: productData.category.trim().toUpperCase().replace(/\s+/g, '_'),
            type: productData.type.trim().toUpperCase().replace(/\s+/g, '_'),
            material: productData.material.trim().toUpperCase().replace(/\s+/g, '_'),
        };
    }

    normalizeResponseProductData(productData) {
        return {
            ...productData,
            category: productData.category.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase()),
            type: productData.type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase()),
            material: productData.material.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, char => char.toUpperCase()),
        };
    }


    async updateProduct(id, productData, files, imagesToKeep) {
        try {
            // const existingProduct = await this.getProductById(id);
            const existingProduct = await Product.findByPk(id, {
                include: [{ model: ProductImage, as: 'images' }],
            });
            if (!existingProduct) {
                throw new Error('Product not found');
            }
            // Update product details
            let furnitureData = productData;
            
            // furnitureData.price = parseFloat(furnitureData.price); // Ensure price is a number
            // furnitureData.category = furnitureData.category.toUpperCase(); // Ensure category is uppercase
            // furnitureData.type = furnitureData.type.toUpperCase(); // Ensure type is uppercase
            // furnitureData.material = furnitureData.material.toUpperCase(); // Ensure material is uppercase

            furnitureData = this.normalizeReceivedProductData(furnitureData);

            await existingProduct.update(furnitureData);

            // Handle images
            const existingImages = existingProduct.images.map(img => img.imageUrl);
            const imagesToDelete = existingImages.filter(url => !imagesToKeep.includes(url));
            
            // Delete images that are not in imagesToKeep
            await fileService.deleteFiles(imagesToDelete);
            await ProductImage.destroy({ where: { productId: id, imageUrl: imagesToDelete } });

            // Save new files
            if (files && files.length > 0) {
                const newImageUrls = await Promise.all(
                    files.map(async (file) => {
                        const fileUrl = await fileService.saveFile(file);
                        return { imageUrl: fileUrl, productId: id };
                    })
                );
                await ProductImage.bulkCreate(newImageUrls);
            }
            let response = await this.getProductById(id);
            response = this.normalizeResponseProductData(response);
            return response;
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async deleteProduct(id) {
        // const existingProduct = await this.getProductById(id);
        const existingProduct = await Product.findByPk(id, {
            include: [{ model: ProductImage, as: 'images' }],
        });
        if (!existingProduct) {
            throw new Error('Product not found');
        }
        // Delete associated images
        const imageUrls = existingProduct.images.map(img => img.imageUrl);
        await fileService.deleteFiles(imageUrls);
        await ProductImage.destroy({ where: { productId: id } });

        // Delete the product
        await existingProduct.destroy();
    }
}

module.exports = new ProductService();
const sequelize = require('../config/database');
const ProductImageModel = require('./productImage');
const ProductModel = require('./product');

const Product = ProductModel(sequelize);
const ProductImage = ProductImageModel(sequelize);

ProductImage.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });

module.exports = {
  sequelize,
  Product,
  ProductImage,
};
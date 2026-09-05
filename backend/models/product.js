const { DataTypes } = require('sequelize');
const { FURNITURE_TYPE, FURNITURE_CATEGORY, FURNITURE_MATERIAL } = require('./enums');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM(...Object.values(FURNITURE_TYPE)),
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM(...Object.values(FURNITURE_CATEGORY)),
            allowNull: false
        },
        material: {
            type: DataTypes.ENUM(...Object.values(FURNITURE_MATERIAL)),
            allowNull: false
        },
        createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        },
        updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        },
    }, {
        timestamps: true,
        indexes: [
      { fields: ['name'] },
      { fields: ['type'] },
      { fields: ['category'] },
      { fields: ['material'] },
    ],
  });

  return Product;
};

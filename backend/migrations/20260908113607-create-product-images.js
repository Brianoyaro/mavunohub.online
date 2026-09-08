'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductImages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: 'Products',
          key: 'id',
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ProductImages');
  },
};

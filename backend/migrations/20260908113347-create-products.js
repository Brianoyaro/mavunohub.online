'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM(
          'BED',
          'SOFAS',
          'DINING_SET',
          'DINING_TABLE',
          'DINING_CHAIR',
          'HOME_OTHER',
          'OFFICE_CHAIR',
          'BOARDROOM_TABLE',
          'WORKSTATION',
          'OFFICE_SOFA',
          'OFFICE_DESK',
          'OFFICE_OTHER'
        ),
        allowNull: false,
      },

      category: {
        type: Sequelize.ENUM(
          'HOME',
          'OFFICE',
          'OUTDOOR',
          'BEDROOM',
          'LIVING_ROOM'
        ),
        allowNull: false,
      },

      material: {
        type: Sequelize.ENUM(
          'WOOD',
          'PLASTIC',
          'METAL',
          'GLASS',
          'FABRIC'
        ),
        allowNull: false,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('Products', ['name']);
    await queryInterface.addIndex('Products', ['type']);
    await queryInterface.addIndex('Products', ['category']);
    await queryInterface.addIndex('Products', ['material']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Products');
  },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'vendorcode', {
      type: Sequelize.DataTypes.STRING,
      // allowNull: false,
      unique: true,
    });
    return;
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'vendorcode');
    return;
  },
};

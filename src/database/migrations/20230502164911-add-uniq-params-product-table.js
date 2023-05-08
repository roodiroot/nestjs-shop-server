'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.changeColumn('products', 'name', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.changeColumn('products', 'name', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    });
  },
};

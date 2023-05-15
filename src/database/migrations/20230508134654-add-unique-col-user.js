'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.addColumn('users', 'username', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    });
    return;
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('products', 'name', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    });
    await queryInterface.removeColumn('users', 'username');
    return;
  },
};

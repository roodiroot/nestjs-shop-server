'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'numberOfViews', {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('products', 'hit', {
      type: Sequelize.DataTypes.BOOLEAN,
    });
    return;
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'numberOfViews');
    await queryInterface.removeColumn('products', 'hit');
    return;
  },
};

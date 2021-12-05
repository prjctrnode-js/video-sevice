'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Videos', [
      {
        userId: 1,
        fileName: 'video1.mp4',
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
      {
        userId: 2,
        fileName: 'video2.mp4',
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW'),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Services', null, {});
  },
};

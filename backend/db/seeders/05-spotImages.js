'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
    {
        url:  "https://img.freepik.com/premium-photo/surrealistic-image-notary-public-s-office-floating-sky-surrounded-by-fluffy-clouds_891336-47882.jpg",
        preview: true,
        spotId: 1,
        userId:1
    },
    {
        url:  "https://img.100r.systems/img/4324132b1f939b0a56173237590e9a11.jpg",
        preview: true,
        spotId: 2,
        userId: 2
    },
    {
      url:  "https://img.freepik.com/premium-photo/surreal-floating-island-with-house-top-island-is-covered-green-grass-trees-house-is-made-wood-has-stone-chimney_14117-480617.jpg",
      preview: true,
      spotId: 3,
      userId: 3
     }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
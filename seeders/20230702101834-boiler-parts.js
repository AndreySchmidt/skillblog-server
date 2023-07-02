'use strict';

const { faker } = require('@faker-js/faker');

const boilerManufacturers = [
  'name',
  'name1',
  'name2',
  'name3',
  'name4',
  'name5',
  'name6',
];
const partsManufacturers = [
  'pname',
  'pname1',
  'pname2',
  'pname3',
  'pname4',
  'pname5',
  'pname6',
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'BoilerParts',
      [...Array(50)].map(() => ({
        boiler_manufacturer:
          boilerManufacturers[
            Math.floor(Math.random() * boilerManufacturers.length)
          ],
        parts_manufacturer:
          partsManufacturers[
            Math.floor(Math.random() * partsManufacturers.length)
          ],
        price: faker.random.numeric(4),
        name: faker.lorem.sentence(2),
        description: faker.lorem.sentence(10),
        images: JSON.stringify(
          [...Array(7)].map(
            () =>
              `${faker.image.technics()}?random=${faker.random.numeric(30)}`,
          ),
        ),
        vendor_code: faker.internet.password(),
        in_stok: faker.random.numeric(1),
        bestseller: faker.datatype.boolean(),
        new: faker.datatype.boolean(),
        popularity: faker.random.numeric(3),
        compatibility: faker.lorem.sentence(7),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      {},
    );
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('BoilerParts', null, {});

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

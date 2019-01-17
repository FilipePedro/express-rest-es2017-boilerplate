const faker = require('faker');

const fakerUserData = () => ({
  email: faker.internet.email(),
  name: faker.name.findName(),
  password: faker.internet.password(),
  role: faker.random.arrayElement(['user', 'admin']),
});

module.exports = {
  fakerUserData,
};

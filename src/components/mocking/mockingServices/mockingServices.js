const faker = require('faker');
const { Product } = require('../../../models/products');
const { Cart } = require('../../../models/carts');
const { User } = require('../../../models/users');
const { productsServices, usersServices, cartsServices } = require('../../../repositories/index');
const { createHash } = require('../../../utils/bcrypt/bcrypt');
const req = require('../../../utils/logger/loggerSetup');
const NUM_FAKE_PRODUCTS = 10;

class MockingServices {
  addMocking = async (res) => {
    try {
      const fakeUser = new User({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        age: faker.datatype.number({ min: 18, max: 99 }),
        password: createHash('1234'),
        role: 'premium',
        platform: 'direct',
        last_connection: faker.date.past(),
        token: faker.datatype.uuid(),
        products: [],
      });
      const fakeCart = new Cart({
        products: [],
      });
      fakeUser.cart = fakeCart;

      const savedUser = await usersServices.save(fakeUser);
      const fakeProducts = [];
      for (let i = 0; i < NUM_FAKE_PRODUCTS; i++) {
        const fakeProduct = new Product({
          title: faker.commerce.productName(),
          description: limitDescriptionToFiveWords(faker.lorem.sentence()),
          code: faker.random.alphaNumeric(6),
          price: faker.datatype.number({ min: 1, max: 1000 }),
          stock: faker.datatype.number({ min: 0, max: 100 }),
          category: faker.commerce.department(),
          thumbnails: ['imageFaker.png'],
          owner: {
            role: 'premium',
            id: savedUser._id,
          },
        });
        await productsServices.save(fakeProduct);
        fakeCart.products.push({
          productId: fakeProduct._id,
          quantity: 1,
        });
        savedUser.products.push(fakeProduct._id);
        fakeProducts.push(fakeProduct);
      }
      await usersServices.save(savedUser);
      await cartsServices.save(fakeCart);
      const data = fakeProducts;
      req.logger.info('Products and Premium Owner User of the products successfully created with Faker.');
      return res.sendSuccess({ message: 'Products and User successfully created', payload: data });
    } catch (error) {
      req.logger.error('Error generating fake products.');
      return res.sendError({ message: 'Error generating fake products', error });
    }
  };
}
function limitDescriptionToFiveWords(description) {
  const words = description.split(' ');
  return words.slice(0, 5).join(' ');
}
module.exports = new MockingServices();

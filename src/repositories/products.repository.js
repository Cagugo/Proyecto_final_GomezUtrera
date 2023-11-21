const { Product } = require('../models/products');
const BaseRepository = require('./base.repository');
const req = require('../utils/logger/loggerSetup');

class ProductsRepository extends BaseRepository {
  constructor() {
    super(Product);
  }
  async populateOwner(product) {
    try {
      await product.populate('owner');
      return product;
    } catch (error) {
      req.logger.error('Error in ProductsRepository populateOwner:', error);
      throw new Error(`Error in ProductsRepository populateOwner: ${error.message}`);
    }
  }
}
module.exports = ProductsRepository;

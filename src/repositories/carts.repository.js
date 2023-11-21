const { Cart } = require('../models/carts');
const BaseRepository = require('./base.repository');
const req = require('../utils/logger/loggerSetup');

class CartsRepository extends BaseRepository {
  constructor() {
    super(Cart);
  }
  findCartById = async (id, populateOptions = {}) => {
    try {
      const item = await this.model.findById(id).populate(populateOptions).exec();
      if (!item) {
        return null;
      }
      return item;
    } catch (error) {
      req.logger.error('Error in CartsRepository findCartById:', error);
      throw new Error(`Error in CartsRepository findCartById: ${error.message}`);
    }
  };
}
module.exports = CartsRepository;

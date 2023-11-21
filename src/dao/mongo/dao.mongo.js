/* ************************************************************************** */
/* src/dao/mongo/dao.mongo.js */
/* ************************************************************************** */

const req = require('../../utils/logger/loggerSetup');

class MongoDAO {
  constructor(model) {
    this.model = model;
    this.defaultTimeout = 30000;
  }

  setDefaultTimeout(timeout) {
    this.defaultTimeout = timeout;
  }

  async create(data) {
    try {
      const document = new this.model(data);
      const result = await document.save();
      return result;
    } catch (error) {
      req.logger.error('Error en MongoDAO create::', error);
      throw new Error(`Error en MongoDAO create: ${error.message}`);
    }
  }

  async findById(id, populateOptions = {}) {
    try {
      const query = this.model.findById(id);
      if (populateOptions.path) {
        query.populate(populateOptions);
      }
      const result = await query.exec();
      return result;
    } catch (error) {
      req.logger.error('Error en MongoDAO findById:', error);
      throw new Error(`Error en MongoDAO findById: ${error.message}`);
    }
  }

  async findByIdAndUpdate(id, data, populateOptions = {}) {
    try {
      const query = this.model.findByIdAndUpdate(id, data, { new: true });
      if (populateOptions.path) {
        query.populate(populateOptions);
      }
      const result = await query.exec();
      return result;
    } catch (error) {
      req.logger.error('Error en MongoDAO findByIdAndUpdate:', error);
      throw new Error(`Error en MongoDAO findByIdAndUpdate: ${error.message}`);
    }
  }

  async findByIdAndDelete(id, populateOptions = {}) {
    try {
      let query = this.model.findByIdAndDelete(id);

      if (populateOptions.path) {
        query = query.populate(populateOptions);
      }

      const result = await query.exec();
      return result;
    } catch (error) {
      req.logger.error('Error en MongoDAO findByIdAndDelete:', error);
      throw new Error(`Error en MongoDAO findByIdAndDelete: ${error.message}`);
    }
  }

  async findOne(query = {}, populateOptions = {}) {
    try {
      const findOneQuery = this.model.findOne(query);
      if (populateOptions.path) {
        findOneQuery.populate(populateOptions);
      }
      const result = await findOneQuery.exec();
      return result;
    } catch (error) {
      req.logger.error('Error en MongoDAO findOne:', error);
      throw new Error(`Error en MongoDAO findOne: ${error.message}`);
    }
  }

  async findAll(query = {}, options = {}, populateOptions = {}) {
    try {
      const findQuery = this.model.find(query, null, options);
      if (populateOptions.path) {
        findQuery.populate(populateOptions);
      }
      const result = await findQuery.exec();
      return result;
    } catch (error) {
      req.logger.error('Error en MongoDAO findAll:', error);
      throw new Error(`Error en MongoDAO findAll: ${error.message}`);
    }
  }

  async save(data, populateOptions = {}) {
    try {
      const document = new this.model(data);

      if (populateOptions.path) {
        await document.populate(populateOptions).execPopulate();
      }

      const result = await document.save();
      return result;
    } catch (error) {
      req.logger.error('Error en MongoDAO save:', error);
      throw new Error(`Error en MongoDAO save: ${error.message}`);
    }
  }

  async countDocuments(query = {}, populateOptions = {}) {
    try {
      let countQuery = this.model.countDocuments(query);

      if (populateOptions.path) {
        countQuery = countQuery.populate(populateOptions);
      }

      const count = await countQuery.exec();
      return count;
    } catch (error) {
      req.logger.error('Error en MongoDAO countDocuments:', error);
      throw new Error(`Error en MongoDAO countDocuments: ${error.message}`);
    }
  }

  async paginate(query = {}, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const findQuery = this.model.find(query).skip(skip).limit(limit);
      const result = await findQuery.exec();

      const paginationData = {
        docs: result,
        page: page,
        limit: limit,
        totalDocs: result.length,
      };

      return paginationData;
    } catch (error) {
      req.logger.error('Error en MongoDAO paginateData:', error);
      throw new Error(`Error in MongoDAO paginateData: ${error.message}`);
    }
  }

  async deleteOne(query) {
    try {
      const result = await this.model.deleteOne(query);
      return result;
    } catch (error) {
      req.logger.error('Error en MongoDAO deleteOne:', error);
      throw new Error(`Error en MongoDAO deleteOne: ${error.message}`);
    }
  }
}

module.exports = MongoDAO;

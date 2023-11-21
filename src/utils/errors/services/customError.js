const req = require('../../../utils/logger/loggerSetup');
class CustomError {
  static createError({ name = 'Error', cause, message, code = 1 }) {
    const error = new Error(message, { cause });
    error.name = name;
    error.code = code;
    req.logger.error('CustomError.', error);
    throw error;
  }
}
module.exports = CustomError;

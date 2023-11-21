const { args } = require('../../config/index');
const { devLogger, stageLogger, prodLogger } = require('./logger');

function loggerMiddleware(req, res, next) {
  if (args.mode === 'production') {
    req.logger = prodLogger;
  } else if (args.mode === 'staging') {
    req.logger = stageLogger;
  } else {
    req.logger = devLogger;
  }
  next();
}
module.exports = loggerMiddleware;

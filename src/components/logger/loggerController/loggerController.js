const LoggerServices = require('../loggerServices/loggerServices');
class LoggerController {
  getLogger = async (req, res) => {
    await LoggerServices.getLogger(req, res);
  };
}
module.exports = new LoggerController();

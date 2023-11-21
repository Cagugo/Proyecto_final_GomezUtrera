const rolesServices = require('../rolesServices/rolesServices');
class RolesController {
  getAdmin = async (req, res) => {
    return await rolesServices.getAdmin(req, res);
  };
  getPremium = async (req, res) => {
    return await rolesServices.getPremium(req, res);
  };
  getUser = async (req, res) => {
    return await rolesServices.getUser(req, res);
  };
}
module.exports = new RolesController();

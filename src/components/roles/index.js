const CustomRouter = require('../../routes/router');
const rolesController = require('./rolesController/rolesController');
class RolesRoutes extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }
  setupRoutes() {
    const basePath = '/api/sessions';
    this.get(`${basePath}/admintest`, ['ADMIN'], rolesController.getAdmin);
    this.get(`${basePath}/usertest`, ['USER'], rolesController.getUser);
    this.get(`${basePath}/premiumtest`, ['PREMIUM'], rolesController.getPremium);
  }
}
module.exports = new RolesRoutes();

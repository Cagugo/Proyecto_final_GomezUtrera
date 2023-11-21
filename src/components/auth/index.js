const CustomRouter = require('../../routes/router');
const authController = require('./authController/authController');

class Auth extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }
  setupRoutes() {
    const basePath = '/api/session/auth';
    this.router.use(basePath, (req, res, next) => {
      next();
    });
    this.get(`${basePath}/logout`, ['ADMIN', 'USER', 'PREMIUM'], authController.logout);
    this.get(`${basePath}/github`, ['PUBLIC'], authController.githubLogin);
    this.get(`${basePath}/githubcallback`, ['PUBLIC'], authController.githubCallback, authController.githubCallbackRedirect);
    this.get(`${basePath}/current`, ['ADMIN', 'USER', 'PREMIUM'], authController.current);
    this.post(`${basePath}/login`, ['PUBLIC'], authController.login);
  }
}
module.exports = new Auth();

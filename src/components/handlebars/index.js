const CustomRouter = require('../../routes/router');
const handlebarsController = require('./handlebarsController/handlebarsController');
const { validateCartId } = require('../../utils/routes/routerParams');
class HandlebarsRoutes extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }
  setupRoutes() {
    this.router.param('cid', validateCartId);
    this.get('/', ['PUBLIC'], handlebarsController.getLogin);
    this.get('/register', ['PUBLIC'], handlebarsController.getRegister);
    this.get('/recovery', ['PUBLIC'], handlebarsController.getRecovery);
    this.get('/products', ['ADMIN', 'USER', 'PREMIUM'], handlebarsController.getProducts);
    this.get('/carts/:cid', ['ADMIN', 'USER', 'PREMIUM'], handlebarsController.getCartProductById);
    this.get('/chat', ['ADMIN', 'USER', 'PREMIUM'], handlebarsController.getChat);
    this.get('/admin', ['ADMIN', 'PREMIUM'], handlebarsController.getAdmin);
    this.get('/admin/dashboard/users', ['ADMIN', 'USER', 'PREMIUM'], handlebarsController.getAdminDashboardUsers);
    this.get('/admin/dashboard/products', ['ADMIN', 'PREMIUM'], handlebarsController.getAdminDashboardProducts);
    this.get('/current', ['ADMIN', 'USER', 'PREMIUM'], handlebarsController.getCurrent);
    this.get('/user', ['ADMIN', 'USER', 'PREMIUM'], handlebarsController.getUser);
    this.get('/user/dashboard', ['ADMIN', 'USER', 'PREMIUM'], handlebarsController.getUserDashboard);
    this.get('/resetpass/:token', ['PUBLIC'], handlebarsController.getResetPass);
    this.get('/resetpassbyemail', ['PUBLIC'], handlebarsController.getResetPassByEmail);
    this.get('/resetpassexpiredtoken', ['PUBLIC'], handlebarsController.getResetPassExpiredToken);
    this.get('/orden/:cid', ['ADMIN', 'USER', 'PREMIUM'], handlebarsController.ordenGetCartProductById);
    this.get('/carts/payments/:cid', ['ADMIN', 'USER', 'PREMIUM'], handlebarsController.getCartById);
  }
}
module.exports = new HandlebarsRoutes();

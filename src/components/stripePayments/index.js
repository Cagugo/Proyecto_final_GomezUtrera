const CustomRouter = require('../../routes/router');
const stripePaymentsController = require('./stripePaymentsController/stripePaymentsController');
const { validateCartId } = require('../../utils/routes/routerParams');

class Payments extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }
  setupRoutes() {
    const basePath = '/api/payments';
    this.router.param('cid', validateCartId);
    this.post(`${basePath}/:cid/stripePayment-intents`, ['PUBLIC'], stripePaymentsController.createPaymentIntent);
    this.post(`${basePath}/`, ['USER', 'ADMIN', 'PREMIUM'], stripePaymentsController.closePayment);
  }
}
module.exports = new Payments();

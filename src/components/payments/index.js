const CustomRouter = require('../../routes/router');
const paymentsController = require('./paymentsController/paymentsController');
const { validateCartId } = require('../../utils/routes/routerParams');

class Payments extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }
  setupRoutes() {
    const basePath = '/api/payments';
    this.router.param('cid', validateCartId);
    this.post(`${basePath}/payment-intents`, ['PUBLIC'], paymentsController.createPaymentIntent);
  }
}
module.exports = new Payments();

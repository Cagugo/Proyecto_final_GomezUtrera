const PaymentsServices = require('../paymentsServices/paymentsServices');

class PaymentsController {
  createPaymentIntent = async (req, res) => {
    return await PaymentsServices.createPaymentIntent(req, res);
  };
}
module.exports = new PaymentsController();

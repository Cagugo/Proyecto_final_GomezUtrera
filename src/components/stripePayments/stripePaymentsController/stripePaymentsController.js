const stripePaymentsServices = require('../stripePaymentsServices/stripePaymentsServices');
class StripePaymentsController {
  createPaymentIntent = async (req, res) => {
    const { cid } = req.params;
    return await stripePaymentsServices.createPaymentIntent(cid, res);
  };
  closePayment = async (req, res) => {
    const token = req.body.token;
    const userData = req.session.user || req.user;
    return await stripePaymentsServices.closePayment(token, userData, req, res);
  };
}
module.exports = new StripePaymentsController();

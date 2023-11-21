const Stripe = require('stripe');
const { config } = require('../../config');
const req = require('../logger/loggerSetup');

class PaymentService {
  constructor() {
    this.stripe = new Stripe(config.stripe_secret_key);
  }
  createPaymentIntent = async (data) => {
    req.logger.info('Payment attempt created successfully');
    try {
      const paymentIntent = await this.stripe.paymentIntents.create(data);
      return paymentIntent;
    } catch (error) {
      throw error;
    }
  };
}
module.exports = { PaymentService };

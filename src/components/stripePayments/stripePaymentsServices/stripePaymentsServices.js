const { PaymentService } = require('../../../utils/stripePayment/stripePayment');
const { Product } = require('../../../models/products');
const { cartsServices } = require('../../../repositories/index');
const { config } = require('../../../config');

class PaymentsServices {
  constructor() {
    this.totalAmount = 0;
  }
  createPaymentIntent = async (cid, res) => {
    try {
      const cart = await cartsServices.findById(cid, { path: 'products.productId' });
      if (!cart) {
        return res.sendNotFound('Cart not found');
      }
      const productsInCart = cart.products;
      const productIds = productsInCart.map((item) => item.productId);
      const products = await Product.find({ _id: { $in: productIds } });
      const totalAmount = productsInCart.reduce((acumulador, item) => {
        const product = products.find((p) => p._id.toString() === item.productId.toString());
        if (product) {
          return acumulador + product.price * item.quantity;
        } else {
          return acumulador;
        }
      }, 0);
      if (totalAmount === 0) {
        return res.status(404).send({ status: 'error', error: 'Products not found in the database' });
      }
      this.totalAmount = totalAmount;
      const totalAmountInCents = totalAmount * 100;
      const infoPaymentIntent = {
        amount: totalAmountInCents,
        currency: 'usd',
      };
      const servicio = new PaymentService();
      let data = await servicio.createPaymentIntent(infoPaymentIntent);
      return res.sendSuccess({
        payload: {
          message: 'Successful payment attempt',
          data,
        },
      });
    } catch (error) {
      return res.sendServerError('Payment attempt failed');
    }
  };
  closePayment = async (token, userData, req, res) => {
    try {
      const stripe = require('stripe')(config.stripe_secret_key);
      const { email, first_name, last_name, _id } = userData;
      const customer = await stripe.customers.create({
        email: email,
        name: first_name,
      });
      await stripe.customers.createSource(customer.id, {
        source: token,
      });
      const charge = await stripe.charges.create({
        amount: this.totalAmount * 100,
        currency: 'USD',
        description: 'Successful payment made',
        customer: customer.id,
        metadata: {
          customer_id: _id,
          last_name: last_name,
          name: first_name,
        },
      });
      const data = charge;
      req.logger.info('Successful payment closure');
      return res.sendSuccess({
        payload: {
          message: 'Successful payment closure',
          data,
        },
      });
    } catch (error) {
      req.logger.error('ClosePayment error .', error);
      return res.sendServerError({
        payload: {
          message: 'Payment closing error',
          error,
        },
      });
    }
  };
}
module.exports = new PaymentsServices();

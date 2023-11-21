const { PaymentService } = require('../../../utils/stripePayment/stripePayment');

class PaymentsServices {
  createPaymentIntent = async (req, res) => {
    const products = [
      { id: 1, name: 'tacos', price: 1000 },
      { id: 2, name: 'tostadas', price: 500 },
      { id: 3, name: 'Aguacate', price: 1500 },
      { id: 4, name: 'tortillas', price: 1000 },
      { id: 5, name: 'Aguas frescas', price: 800 },
    ];
    try {
      const productRequested = products.find((product) => product.id === parseInt(req.query.id));

      if (!productRequested) {
        return res.sendNotFound('Product not found');
      }
      const paymentIntentInfo = {
        amount: productRequested.price,
        currency: 'usd',
      };
      const service = new PaymentService();
      let data = await service.createPaymentIntent(paymentIntentInfo);

      return res.sendSuccess({
        payload: {
          message: 'PaymentServices success',
          data,
        },
      });
    } catch (error) {
      return res.sendServerError('PaymentServices implementation failed');
    }
  };
}
module.exports = new PaymentsServices();

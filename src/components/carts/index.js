const CustomRouter = require('../../routes/router');
const cartsController = require('./cartsController/cartsController');
const { validateCartId, validateProductId } = require('../../utils/routes/routerParams');

class Carts extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }
  setupRoutes() {
    const basePath = '/api/carts';
    this.router.param('cid', validateCartId);
    this.router.param('pid', validateProductId);
    this.get(`${basePath}/`, ['ADMIN', 'PREMIUM'], cartsController.getCarts);
    this.get(`${basePath}/:cid`, ['ADMIN'], cartsController.getCartProductById);
    this.post(`${basePath}/`, ['ADMIN'], cartsController.addCart);
    this.post(`${basePath}/:cid/product/:pid`, ['USER', 'PREMIUM'], cartsController.addProductToCart);
    this.post(`${basePath}/:cid/purchase`, ['USER', 'PREMIUM'], cartsController.purchaseCart);
    this.post(`${basePath}/:cid/purchasecart`, ['USER', 'PREMIUM'], cartsController.purchaseCartMail);
    this.put(`${basePath}/:cid`, ['ADMIN'], cartsController.updateCart);
    this.put(`${basePath}/:cid/product/:pid`, ['USER', 'PREMIUM'], cartsController.updateProductQuantity);
    this.delete(`${basePath}/:cid`, ['ADMIN'], cartsController.deleteCart);
    this.delete(`${basePath}/:cid/product/:pid`, ['ADMIN', 'USER', 'PREMIUM'], cartsController.deleteProductFromCart);
    this.delete(`${basePath}/:cid/products`, ['ADMIN', 'USER', 'PREMIUM'], cartsController.deleteAllProductsFromCart);
  }
}
module.exports = new Carts();

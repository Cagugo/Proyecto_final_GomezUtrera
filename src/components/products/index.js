const CustomRouter = require('../../routes/router');
const productsController = require('./productsController/productsController');
const { uploadProducts } = require('../../utils/multer/multer');
const { validateProductId } = require('../../utils/routes/routerParams');

class ProductsRoutes extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }
  setupRoutes() {
    const basePath = '/api/products';
    this.router.param('pid', validateProductId);
    this.get(`${basePath}/`, ['ADMIN', 'PREMIUM'], productsController.getProducts);
    this.get(`${basePath}/:pid`, ['ADMIN'], productsController.getProductById);
    this.post(`${basePath}/`, ['ADMIN', 'PREMIUM'], uploadProducts.array('image', 5), productsController.addProduct);
    this.put(`${basePath}/:pid`, ['ADMIN', 'PREMIUM'], uploadProducts.array('image', 5), productsController.updateProduct);
    this.delete(`${basePath}/:pid`, ['ADMIN', 'PREMIUM'], productsController.deleteProduct);
  }
}
module.exports = new ProductsRoutes();

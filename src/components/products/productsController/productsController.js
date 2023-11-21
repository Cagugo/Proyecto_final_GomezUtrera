const ProductsServices = require('../productsServices/productsServices');

class ProductsController {
  getProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    return await ProductsServices.getProducts(limit, page, sort, query, res);
  };
  getProductsViews = async (req, res) => {
    const { limit, page } = req.query;
    return await ProductsServices.getProductsViews(limit, page, query, res);
  };
  getProductById = async (req, res) => {
    const { pid } = req.params;
    return await ProductsServices.getProductById(pid, res);
  };
  addProduct = async (req, res) => {
    const payload = req.body;
    const images = req.files;
    return await ProductsServices.addProduct(payload, images, res, req);
  };
  updateProduct = async (req, res) => {
    const { pid } = req.params;
    const updateFields = req.body;
    const images = req.files;
    return await ProductsServices.updateProduct(pid, updateFields, images, res, req);
  };
  deleteProduct = async (req, res) => {
    const { pid } = req.params;
    return await ProductsServices.deleteProduct(pid, res, req);
  };
}
module.exports = new ProductsController();

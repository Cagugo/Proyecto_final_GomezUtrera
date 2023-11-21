const ProductsServices = require('../../products/productsServices/productsServices');
const UsersServices = require('../../users/usersServices/usersServices');
const Handlebars = require('handlebars');
const { cartsServices, productsServices, usersServices } = require('../../../repositories/index');
const { Product } = require('../../../models/products');
const req = require('../../../utils/logger/loggerSetup');

Handlebars.registerHelper('ifNotNull', function (value, options) {
  if (value !== null && value !== undefined) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
class HandlebarsServices {
  getLogin = async (res) => {
    try {
      return { success: true, title: 'Login', style: 'index.css' };
    } catch (error) {
      req.logger.error('Error Handlebars getLogin:', error);
    }
  };
  getRegister = async (res) => {
    try {
      return { success: true, title: 'Register', style: 'index.css' };
    } catch (error) {
      req.logger.error('Error Handlebars getRegister:', error);
    }
  };
  getRecovery = async (res) => {
    try {
      return { success: true, title: 'Recovery', style: 'index.css' };
    } catch (error) {
      req.logger.error('Error Handlebars getRecovery:', error);
    }
  };
  getProducts = async (limit, page, sort, query, res, userData) => {
    try {
      const products = await ProductsServices.getProductsViews(limit, page, sort, query, res);
      const user = await usersServices.findUserById(userData._id, { path: 'cart' });
      let totalCartProducts = 0;
      if (user && user.cart && user.cart.products) {
        totalCartProducts = user.cart.products.reduce((total, item) => total + item.quantity, 0);
      }
      const context = {
        success: true,
        title: 'Productos',
        products: products.products,
        style: 'index.css',
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        totalPages: products.totalPages,
        currentPage: products.currentPage,
        prevLink: products.prevLink,
        nextLink: products.nextLink,
        user: userData,
        totalCartProducts: totalCartProducts,
      };
      return context;
    } catch (error) {
      req.logger.error('Error Handlebars getProducts:', error);
    }
  };
  getCartProductById = async (cid, res, userData) => {
    try {
      const cart = await cartsServices.findCartById(cid, { path: 'products.productId', select: '-__v' });
      const formattedCart = {
        _id: cart._id,
        products: cart.products.map((item) => ({
          productId: {
            _id: item.productId._id,
            title: item.productId.title,
            description: item.productId.description,
            code: item.productId.code,
            price: item.productId.price,
            stock: item.productId.stock,
            category: item.productId.category,
          },
          quantity: item.quantity,
        })),
      };
      let totalCartProducts = 0;
      if (formattedCart.products && formattedCart.products.length > 0) {
        totalCartProducts = formattedCart.products.reduce((total, item) => total + item.quantity, 0);
      }
      const productsInCart = cart.products;
      const productIds = productsInCart.map((item) => item.productId);
      const products = await Product.find({ _id: { $in: productIds } });
      const totalAmount = await this.calculateTotalAmount(productsInCart, products);
      const context = {
        success: true,
        title: 'Carts',
        carts: [formattedCart],
        cartId: cid,
        style: 'index.css',
        user: userData,
        totalCartProducts: totalCartProducts,
        totalAmount: totalAmount,
      };
      return context;
    } catch (error) {
      req.logger.error('Error Handlebars getCartProductById:', error);
    }
  };
  getChat = async (res) => {
    try {
      return { success: true, title: 'Chat', style: 'index.css' };
    } catch (error) {
      req.logger.error('Error Handlebars getChat:', error);
    }
  };
  getAdmin = async (res) => {
    try {
      return { success: true, title: 'Admin | Profile', style: 'index.css' };
    } catch (error) {
      req.logger.error('Error Handlebars getAdmin:', error);
    }
  };
  getAdminDashboardUsers = async (limit, page, query, res, userData) => {
    try {
      const users = await UsersServices.getUsersViews(limit, page, query, res);
      let totalCartProducts = 0;
      const context = {
        success: true,
        title: 'Admin | Dashboard | Users',
        users: users.users,
        style: 'index.css',
        hasPrevPage: users.hasPrevPage,
        hasNextPage: users.hasNextPage,
        prevPage: users.prevPage,
        nextPage: users.nextPage,
        totalPages: users.totalPages,
        currentPage: users.currentPage,
        prevLink: users.prevLink,
        nextLink: users.nextLink,
        user: userData,
        totalCartProducts: totalCartProducts,
      };
      return context;
    } catch (error) {
      req.logger.error('Error Handlebars getAdminDashboardUsers:', error);
    }
  };
  getAdminDashboardProducts = async (limit, page, query, res, userData) => {
    try {
      const products = await ProductsServices.getProductsViews(limit, page, query, res);
      let totalCartProducts = 0;
      const context = {
        success: true,
        title: 'Admin | Dashboard | Products',
        products: products.products,
        style: 'index.css',
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        totalPages: products.totalPages,
        currentPage: products.currentPage,
        prevLinkAdmin: products.prevLinkAdmin,
        nextLinkAdmin: products.nextLinkAdmin,
        user: userData,
        totalCartProducts: totalCartProducts,
      };
      return context;
    } catch (error) {
      req.logger.error('Error Handlebars getProducts:', error);
    }
  };
  getAdminDashboard = async (limit, page, query, res, userData) => {
    try {
      const products = await ProductsServices.getProductsViews(limit, page, query, res);
      let totalCartProducts = 0;
      const context = {
        success: true,
        title: 'Admin | Dashboard |',
        products: products.products,
        style: 'index.css',
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        totalPages: products.totalPages,
        currentPage: products.currentPage,
        prevLinkAdmin: products.prevLinkAdmin,
        nextLinkAdmin: products.nextLinkAdmin,
        user: userData,
        totalCartProducts: totalCartProducts,
      };
      return context;
    } catch (error) {
      req.logger.error('Error Handlebars getProducts:', error);
    }
  };
  getCurrent = async (res) => {
    try {
      return { success: true, title: 'Current', style: 'index.css' };
    } catch (error) {
      req.logger.error('Error Handlebars getCurrent:', error);
    }
  };
  getUser = async (res) => {
    try {
      return { success: true, title: 'User | Profile', style: 'index.css' };
    } catch (error) {
      req.logger.error('Error Handlebars getUser:', error);
    }
  };
  getUserDashboard = async (userData) => {
    try {
      const context = {
        success: true,
        title: 'User | Dashboard',
        style: 'index.css',
        user: userData,
      };
      return context;
    } catch (error) {
      req.logger.error('Error Handlebars getUser:', error);
    }
  };
  getResetPass = async (res) => {
    try {
      return { success: true, title: 'Reset', style: 'index.css' };
    } catch (error) {
      req.logger.error('Error Handlebars getReset:', error);
    }
  };
  getResetPassByEmail = async (res) => {
    try {
      return { success: true, title: 'Reset', style: 'index.css' };
    } catch (error) {
      req.logger.error('Error Handlebars getReset:', error);
    }
  };
  getResetPassExpiredToken = async (res) => {
    try {
      return { success: true, title: 'Expired link', style: 'index.css' };
    } catch (error) {
      req.logger.error('Error Handlebars getReset:', error);
    }
  };
  ordenGetCartProductById = async (cid, res, userData) => {
    try {
      const cart = await cartsServices.findCartById(cid, { path: 'products.productId', select: '-__v' });
      const formattedCart = {
        _id: cart._id,
        products: cart.products.map((item) => ({
          productId: {
            _id: item.productId._id,
            title: item.productId.title,
            description: item.productId.description,
            code: item.productId.code,
            price: item.productId.price,
            stock: item.productId.stock,
            category: item.productId.category,
          },
          quantity: item.quantity,
        })),
      };
      let totalCartProducts = 0;
      if (formattedCart.products && formattedCart.products.length > 0) {
        totalCartProducts = formattedCart.products.reduce((total, item) => total + item.quantity, 0);
      }
      const productsInCart = cart.products;
      const productIds = productsInCart.map((item) => item.productId);
      const products = await Product.find({ _id: { $in: productIds } });
      const totalAmount = await this.calculateTotalAmount(productsInCart, products);
      const context = {
        success: true,
        title: 'Orden de compra',
        carts: [formattedCart],
        cartId: cid,
        style: 'index.css',
        user: userData,
        totalCartProducts: totalCartProducts,
        totalAmount: totalAmount,
      };
      return context;
    } catch (error) {
      req.logger.error('Error Handlebars getCartProductById:', error);
    }
  };
  getCartById = async (cid, res, userData) => {
    try {
      const cart = await cartsServices.findCartById(cid, { path: 'products.productId', select: '-__v' });
      const formattedCart = {
        _id: cart._id,
        products: cart.products.map((item) => ({
          productId: {
            _id: item.productId._id,
            title: item.productId.title,
            description: item.productId.description,
            code: item.productId.code,
            price: item.productId.price,
            stock: item.productId.stock,
            category: item.productId.category,
          },
          quantity: item.quantity,
        })),
      };
      let totalCartProducts = 0;
      if (formattedCart.products && formattedCart.products.length > 0) {
        totalCartProducts = formattedCart.products.reduce((total, item) => total + item.quantity, 0);
      }
      const productsInCart = cart.products;
      const productIds = productsInCart.map((item) => item.productId);
      const products = await Product.find({ _id: { $in: productIds } });
      const totalAmount = await this.calculateTotalAmount(productsInCart, products);
      const context = {
        success: true,
        title: 'Payments',
        carts: [formattedCart],
        cartId: cid,
        style: 'index.css',
        user: userData,
        totalCartProducts: totalCartProducts,
        totalAmount: totalAmount,
      };
      return context;
    } catch (error) {
      req.logger.error('Error Handlebars getCartProductById:', error);
    }
  };
  getTotalProducts = async () => {
    try {
      const totalProducts = await productsServices.countDocuments({});
      return totalProducts;
    } catch (error) {
      req.logger.error('Error when obtaining total products:', error);
      return 0;
    }
  };
  getTotalUsers = async () => {
    try {
      const totalUsers = await usersServices.countDocuments({});
      return totalUsers;
    } catch (error) {
      req.logger.error('Error when obtaining total users:', error);
      return 0;
    }
  };
  calculateTotalAmount = async (productsInCart, products) => {
    try {
      const totalAmount = productsInCart.reduce((accumulator, item) => {
        const product = products.find((p) => p._id.toString() === item.productId._id.toString());
        if (product) {
          return accumulator + product.price * item.quantity;
        } else {
          return accumulator;
        }
      }, 0);
      return totalAmount;
    } catch (error) {
      req.logger.error('Error in calculateTotalAmount:', error);
    }
  };
}
module.exports = new HandlebarsServices();

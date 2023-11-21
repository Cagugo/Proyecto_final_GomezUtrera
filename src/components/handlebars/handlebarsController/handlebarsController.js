const HandlebarsServices = require('../handlebarsServices/handlebarsServices');
const { usersServices } = require('../../../repositories/index');
const { getTotalProducts, getTotalUsers } = require('../handlebarsServices/handlebarsServices');
const jwt = require('jsonwebtoken');
const { config } = require('../../../config');
const { Product } = require('../../../models/products');

class HandlebarsController {
  getLogin = async (req, res) => {
    const data = await HandlebarsServices.getLogin(res);
    return res.render('login', data);
  };
  getRegister = async (req, res) => {
    const data = await HandlebarsServices.getRegister(res);
    return res.render('register', data);
  };
  getRecovery = async (req, res) => {
    const data = await HandlebarsServices.getRecovery(res);
    return res.render('recovery', data);
  };
  getProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const userData = req.session.user || req.user;
    const data = await HandlebarsServices.getProducts(limit, page, sort, query, res, userData);
    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(userData);
    const context = { user: userWithCurrentDTO, ...data };
    return res.render('products', context);
  };
  getCartProductById = async (req, res) => {
    const { cid } = req.params;
    const cartId = cid;
    const userData = req.session.user || req.user;
    const data = await HandlebarsServices.getCartProductById(cartId, res, userData);
    return res.render('carts', data);
  };
  getChat = async (req, res) => {
    const data = await HandlebarsServices.getChat(res);
    return res.render('chat', data);
  };
  getAdmin = async (req, res) => {
    const data = await HandlebarsServices.getAdmin(res);
    const userData = req.session.user || req.user;
    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(userData);
    const context = { user: userWithCurrentDTO, ...data };
    return res.render('adminProfile', context);
  };
  getAdminDashboardUsers = async (req, res) => {
    const { limit, page, query } = req.query;
    const userData = req.session.user || req.user;
    const totalUsers = await getTotalUsers();
    const data = await HandlebarsServices.getAdminDashboardUsers(limit, page, query, res, userData);
    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(userData);
    const context = { user: userWithCurrentDTO, ...data, totalUsers };
    return res.render('adminDashboardUsers', context);
  };
  getAdminDashboardProducts = async (req, res) => {
    const { limit, page, query } = req.query;
    const userData = req.session.user || req.user;
    const totalProducts = await getTotalProducts();
    const data = await HandlebarsServices.getAdminDashboardProducts(limit, page, query, res, userData);
    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(userData);
    const context = { user: userWithCurrentDTO, ...data, totalProducts };
    return res.render('adminDashboardProducts', context);
  };
  getCurrent = async (req, res) => {
    const data = await HandlebarsServices.getCurrent(res);
    const user = req.session.user || req.user;
    if (!user) {
      return res.sendServerError('Usuario no autorizado');
    }
    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(user);
    const context = { user: userWithCurrentDTO, ...data };
    return res.render('current', context);
  };
  getUser = async (req, res) => {
    const data = await HandlebarsServices.getUser(res);
    const userData = req.session.user || req.user;
    const userWithCurrentDTO = await usersServices.getUserWithCurrentDTO(userData);
    const context = { user: userWithCurrentDTO, ...data };
    return res.render('userProfile', context);
  };
  getUserDashboard = async (req, res) => {
    try {
      const userData = req.session.user || req.user;
      const user = await usersServices.findUserById(userData._id, { path: 'documents' });
      if (!user) {
        return res.sendNotFound('Usuario no encontrado');
      }
      const products = await Product.find({ _id: { $in: user.products } });
      const data = await HandlebarsServices.getUserDashboard(userData);
      if (user.documents_status) {
        data.documents_status = user.documents_status;
      }
      if (user.premium_documents_status) {
        data.premium_documents_status = user.premium_documents_status;
      }
      const context = { user, documents: user.documents, products, ...data };
      return res.render('userDashboard', context);
    } catch (error) {
      return res.sendServerError('Error getting user data');
    }
  };
  getResetPass = async (req, res) => {
    const data = await HandlebarsServices.getResetPass(res);
    const { token } = req.params;
    jwt.verify(token, config.jwt_secret, (err, decodedToken) => {
      if (err) {
        return res.redirect('/resetPassExpiredToken');
      }
      data.token = token;
      return res.render('resetPass', data);
    });
  };
  getResetPassByEmail = async (req, res) => {
    const data = await HandlebarsServices.getResetPassByEmail(res);
    return res.render('resetPassByEmail', data);
  };
  getResetPassExpiredToken = async (req, res) => {
    const data = await HandlebarsServices.getResetPassExpiredToken(res);
    return res.render('resetPassExpiredToken', data);
  };
  ordenGetCartProductById = async (req, res) => {
    const { cid } = req.params;
    const cartId = cid;
    const userData = req.session.user || req.user;
    const data = await HandlebarsServices.ordenGetCartProductById(cartId, res, userData);
    return res.render('ordenDeCompra', data);
  };
  getCartById = async (req, res) => {
    const { cid } = req.params;
    const cartId = cid;
    const userData = req.session.user || req.user;
    const data = await HandlebarsServices.getCartById(cartId, res, userData);
    return res.render('payments', data);
  };
}
module.exports = new HandlebarsController();

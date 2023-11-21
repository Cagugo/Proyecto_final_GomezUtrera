const UsersServices = require('../usersServices/usersServices');

class UsersController {
  getUsers = async (req, res) => {
    const { limit, page, query } = req.query;
    return await UsersServices.getUsers(limit, page, query, res);
  };
  getPrincipalDataUser = async (req, res) => {
    return await UsersServices.getPrincipalDataUser(req, res);
  };
  getUserById = async (req, res) => {
    const { uid } = req.params;
    return await UsersServices.getUserById(uid, res);
  };
  getUsersViews = async (req, res) => {
    const { limit, page, query } = req.query;
    return await UsersServices.getUsersViews(limit, page, query, res);
  };
  registerUser = async (req, res) => {
    const payload = req.body;
    return await UsersServices.registerUser(req, payload, res);
  };
  recoveryUser = async (req, res) => {
    const { email, password } = req.body;
    return await UsersServices.recoveryUser({ email, password, res });
  };
  resetPass = async (req, res) => {
    const { email, password } = req.body;
    return await UsersServices.resetPass({ email, password, res, req });
  };
  resetPassByEmail = async (req, res) => {
    const { email } = req.query;
    await UsersServices.resetPassByEmail(email, res, req);
  };
  uploadDocuments = async (req, res) => {
    const { uid } = req.params;
    const result = await UsersServices.uploadDocuments(uid, res, req);
    return result;
  };
  updateUser = async (req, res) => {
    const { uid } = req.params;
    const updateFields = req.body;
    return await UsersServices.updateUser(uid, updateFields, res, req);
  };
  updateUserPremium = async (req, res) => {
    const { uid } = req.params;
    const updateFields = req.body;
    return await UsersServices.updateUserPremium(uid, updateFields, res, req);
  };
  deleteUser = async (req, res) => {
    const { uid } = req.params;
    return await UsersServices.deleteUser(uid, res, req);
  };
  deleteInactiveUsers = async (req, res) => {
    return await UsersServices.deleteInactiveUsers(req, res);
  };
  deleteDocumentById = async (req, res) => {
    const { uid, did } = req.params;
    return await UsersServices.deleteDocumentById(uid, did, res, req);
  };
  createFakeUser = async (req, res) => {
    return await UsersServices.createFakeUser(req, res);
  };
}
module.exports = new UsersController();

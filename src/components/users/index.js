const CustomRouter = require('../../routes/router');
const usersController = require('./usersController/usersController');
const { validateUserId, validateDocumentId } = require('../../utils/routes/routerParams');
const { uploadProfiles, uploadProducts, uploadDocuments } = require('../../utils/multer/multer');
class UsersRoutes extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }
  setupRoutes() {
    const basePath = '/api/users';
    this.router.param('uid', validateUserId);
    this.router.param('did', validateDocumentId);
    this.get(`${basePath}/`, ['ADMIN'], usersController.getPrincipalDataUser);
    this.get(`${basePath}/getusers`, ['ADMIN'], usersController.getUsers);
    this.get(`${basePath}/:uid`, ['ADMIN'], usersController.getUserById);
    this.post(`${basePath}/register`, ['PUBLIC'], usersController.registerUser);
    this.post(`${basePath}/recovery`, ['PUBLIC'], usersController.recoveryUser);
    this.post(`${basePath}/resetpass`, ['PUBLIC'], usersController.resetPass);
    this.post(`${basePath}/resetpassbyemail`, ['PUBLIC'], usersController.resetPassByEmail);
    this.post(`${basePath}/:uid/documents`, ['ADMIN', 'USER', 'PREMIUM'], uploadDocuments.array('document'), usersController.uploadDocuments);
    this.post(`${basePath}/:uid/documents/identificacion`, ['ADMIN', 'USER', 'PREMIUM'], uploadDocuments.array('identificacion'), usersController.uploadDocuments);
    this.post(`${basePath}/:uid/documents/comprobanteDeDomicilio`, ['ADMIN', 'USER', 'PREMIUM'], uploadDocuments.array('comprobanteDeDomicilio'), usersController.uploadDocuments);
    this.post(`${basePath}/:uid/documents/comprobanteDeEstadoDeCuenta`, ['ADMIN', 'USER', 'PREMIUM'], uploadDocuments.array('comprobanteDeEstadoDeCuenta'), usersController.uploadDocuments);
    this.post(`${basePath}/registerFake`, ['ADMIN'], usersController.createFakeUser);
    this.put(`${basePath}/:uid`, ['ADMIN'], usersController.updateUser);
    this.put(`${basePath}/premium/:uid`, ['ADMIN', 'USER', 'PREMIUM'], usersController.updateUserPremium);
    this.delete(`${basePath}/:uid`, ['ADMIN'], usersController.deleteUser);
    this.delete(`${basePath}/`, ['ADMIN'], usersController.deleteInactiveUsers);
    this.delete(`${basePath}/:uid/documents/:did`, ['ADMIN', 'USER', 'PREMIUM'], usersController.deleteDocumentById);
  }
}
module.exports = new UsersRoutes();

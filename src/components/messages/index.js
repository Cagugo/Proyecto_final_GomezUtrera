const CustomRouter = require('../../routes/router');
const messagesController = require('./messagesController/messagesController');
const { validateMessageId } = require('../../utils/routes/routerParams');

class Messages extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }
  setupRoutes() {
    const basePath = '/api/chat';
    this.router.param('mid', validateMessageId);
    this.get(`${basePath}/`, ['ADMIN'], messagesController.getAllMessages);
    this.post(`${basePath}/`, ['ADMIN', 'USER', 'PREMIUM'], messagesController.addUserMessage);
    this.delete(`${basePath}/:mid`, ['ADMIN', 'USER', 'PREMIUM'], messagesController.deleteUserMessage);
  }
}
module.exports = new Messages();

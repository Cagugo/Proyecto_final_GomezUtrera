const CustomRouter = require('../../routes/router');
const ticketsController = require('./ticketsController/ticketsController');
const { validateTicketId } = require('../../utils/routes/routerParams');

class Tickets extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }
  setupRoutes() {
    const basePath = '/api/tickets';
    this.router.param('tid', validateTicketId);
    this.get(`${basePath}/`, ['ADMIN'], ticketsController.getTickets);
    this.get(`${basePath}/:tid`, ['ADMIN'], ticketsController.getTicketById);
    this.post(`${basePath}/`, ['ADMIN'], ticketsController.addTicket);
    this.delete(`${basePath}/:tid`, ['ADMIN'], ticketsController.deleteTicket);
  }
}
module.exports = new Tickets();

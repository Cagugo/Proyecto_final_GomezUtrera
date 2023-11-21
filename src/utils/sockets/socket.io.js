const { Server: SocketIO } = require('socket.io');

class SocketConfig {
  static instancia = undefined;

  constructor(server) {
    if (SocketConfig.instancia) {
      return SocketConfig.instancia;
    }
    SocketConfig.instancia = this;
    this.io = new SocketIO(server);
    this.mensajes = [];
    this.init();
  }
  init() {
    try {
      this.io.on('connection', (socket) => {
        this.io.sockets.emit('init', this.mensajes);
        socket.on('message', (data) => {
          this.mensajes.push({ ...data });
          this.io.sockets.emit('newMessage', this.mensajes);
        });
        socket.on('newProduct', (product) => {
          this.io.emit('newProduct', product);
        });
        socket.on('updateProduct', (product) => {
          this.io.emit('updateProduct', product);
        });
        socket.on('deleteProduct', (productId) => {
          this.io.emit('deleteProduct', productId);
        });
        socket.on('deleteUser', (userId) => {
          this.io.emit('deleteUser', userId);
        });
        socket.on('deleteDocument', (documentId) => {
          this.io.emit('deleteDocument', documentId);
        });
        socket.on('newDocument', (document) => {
          this.io.emit('newDocument', document);
        });
        socket.on('newStatus', (document) => {
          this.io.emit('newStatus', document);
        });
        socket.on('deleteCartProduct', (productId) => {
          this.io.emit('deleteCartProduct', productId);
        });
        socket.on('deleteAllProductsCart', (cartId) => {
          this.io.emit('deleteAllProductsCart', cartId);
        });
        socket.on('updateTotalCartProducts', (total) => {
          this.io.emit('updateTotalCartProducts', total);
        });
        socket.on('totalAmount', (totalAmount) => {
          this.io.emit('totalAmount', totalAmount);
        });
        socket.on('emptyCart', (totalCartProducts) => {
          this.io.emit('emptyCart', totalCartProducts);
        });
        socket.on('disconnect', () => {});
      });
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = SocketConfig;

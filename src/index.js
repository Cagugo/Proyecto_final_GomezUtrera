const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressHandlebars = require('express-handlebars');
const SocketConfig = require('./utils/sockets/socket.io');
const MongoStore = require('connect-mongo');
const { config } = require('./config');
const { db } = require('./config');
const passport = require('passport');
const initializePassport = require('./config/passport');
const loggerMiddleware = require('./utils/logger/loggerMiddleware');
const req = require('./utils/logger/loggerSetup');
const ErrorHandler = require('./utils/errors/index');
const { swaggerUi, specs } = require('./utils/swagger/swagger');
const { generateFakeProducts } = require('./scripts/generateFakerProducts');
const PORT = `${config.port}` || 3001;

class Server {
  constructor() {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.views();
    this.socket();
  }
  settings() {
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );
    this.app.use(express.static(path.join(__dirname, '/public')));
    this.app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  }
  middlewares() {
    this.app.use(cors('*'));
    this.app.use(cookieParser(`${config.cookie_key}`));
    this.app.use(
      session({
        store: MongoStore.create({
          mongoUrl: `${db.mongo_atlas}${db.dbName}`,
          mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
          ttl: 1800,
        }),
        secret: config.secret_key,
        resave: true,
        saveUninitialized: true,
      })
    );
    initializePassport();
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(ErrorHandler);
    this.app.use(loggerMiddleware);
  }
  routes() {
    routes(this.app);
  }
  views() {
    const handlebars = expressHandlebars.create({
      defaultLayout: 'main',
      helpers: {
        eq: function (a, b, options) {
          return a === b ? 'selected' : '';
        },
        get: function (object, property) {
          return object[property];
        },
        compare: function (a, operator, b, options) {
          const operators = {
            '==': a == b,
            '===': a === b,
            '!=': a != b,
            '!==': a !== b,
            '<': a < b,
            '<=': a <= b,
            '>': a > b,
            '>=': a >= b,
          };
          if (operators[operator]) {
            return options.fn(this);
          } else {
            return options.inverse(this);
          }
        },
      },
    });
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.engine('handlebars', handlebars.engine);
    this.app.set('view engine', 'handlebars');
  }
  socket() {
    const server = require('http').createServer(this.app);
    const socketConfig = new SocketConfig(server);
    this.app.io = socketConfig.io;
  }
  listen() {
    const server = this.app.listen(PORT, () => {
      req.logger.info(`Server running on http://localhost:${PORT}`);
      generateFakeProducts();
    });
    this.app.io.attach(server);
  }
}
module.exports = new Server();

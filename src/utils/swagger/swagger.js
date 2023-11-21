const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const options = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Villa Frida Ecommerce api',
      version: '1.0.0',
      description: 'This API is created to manage your e-commerce.\n\n' + 'Autentication:\n' + '- This API uses a JSON Web Token based authentication system.\n' + '- To access protected endpoints, log in to the /login endpoint.\n' + '- The generated JWT token is stored in cookies.\n' + "- To authorize requests, include the token in the 'Authorize' header'.\n" + '-Each endpoint has the required Role(s) in its description.\n\n',
    },
    security: [
      {
        jwt: [],
      },
    ],
  },
  apis: [path.join(__dirname, '..', '..', 'docs', '**', '**.yaml')],
};
const specs = swaggerJsdoc(options);
module.exports = { swaggerUi, specs };

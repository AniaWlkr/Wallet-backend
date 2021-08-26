const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const PORT = process.env.PORT;

const definition = {
  openapi: '3.0.0',
  info: {
    title: 'API SERVER',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'https://db-wallet.herokuapp.com',
      description: 'API base URL',
    },
    {
      url: `http://localhost:${PORT}`,
      description: 'Development API',
    },
  ],
  // securityDefinitions: {
  //   bearerAuth: {
  //     type: "http",
  //     name: "token",
  //     scheme: "bearer",
  //     bearerFormat: "JWT",
  // }
  // }
};

const options = {
  definition,
  explorer: true,
  swaggerOptions: {
    url: 'http://petstore.swagger.io/v2/swagger.json',
  },
  apis: ['./routes/api/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };

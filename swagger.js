const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Digital Bookstore API',
    description: 'An API for managing books and authors in a digital bookstore.',
  },
  host: 'localhost:3000', // Change to your Render URL when deployed
  schemes: ['http'],      // Change to 'https' for production
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js']; // Path to your main router file

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
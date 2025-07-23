const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Digital Bookstore API',
    description: 'An API for managing books and authors in a digital bookstore.',
  },
  host: 'https://digital-bookstore-api.onrender.com', 
  schemes: ['https'],      
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js']; // Path to your main router file

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
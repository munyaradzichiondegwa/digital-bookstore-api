const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Digital Bookstore API',
    description: 'An API for managing books and authors in a digital bookstore.'
  },
  host: 'digital-bookstore-api.onrender.com',
  schemes: ['https'],
  basePath: '/'
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger file generated successfully!');
});
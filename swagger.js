const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Digital Bookstore API',
    description:
      'An API for managing books and authors. Some routes require authentication via GitHub OAuth to create, update, or delete entries.',
  },
  host: 'digital-bookstore-api.onrender.com',
  schemes: ['https'],
  basePath: '/',
  securityDefinitions: {
    github_oauth: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: 'https://digital-bookstore-api.onrender.com/auth/github',
      scopes: {},
    },
  },
  definitions: {
    Book: {
      title: 'The Great Gatsby',
      authorId: '66a16d8a7f1f3a8e1b9b3b4a',
      publicationYear: 1925,
      genre: 'Classic',
      isbn: '978-0743273565',
      publisher: "Charles Scribner's Sons",
      pageCount: 180,
      coverType: 'Paperback',
      summary: 'A novel about the American dream during the Roaring Twenties.',
    },
    Author: {
      firstName: 'F. Scott',
      lastName: 'Fitzgerald',
      birthYear: 1896,
      nationality: 'American',
    },
    BookInput: {
      $title: 'The Great Gatsby',
      $authorId: '66a16d8a7f1f3a8e1b9b3b4a',
      $publicationYear: 1925,
      $genre: 'Classic',
      $isbn: '978-0743273565',
      publisher: "Charles Scribner's Sons",
      $pageCount: 180,
      coverType: 'Paperback',
      $summary: 'A novel about the American dream during the Roaring Twenties.',
    },
    AuthorInput: {
      $firstName: 'F. Scott',
      $lastName: 'Fitzgerald',
      $birthYear: 1896,
      $nationality: 'American',
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js']; // Update this if you have multiple route files

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger file generated successfully!');
});

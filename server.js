const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Redirect root to Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes (no prefix now)
app.use('/', require('./routes'));

// Connect to the database and start the server
db.initDb((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    app.listen(port, () => {
      console.log(`✅ DB Connected and server running on port ${port}`);
    });
  }
});

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();
const port = process.env.PORT || 3000;

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

// Redirect root to Swagger
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API routes (adjust your route files accordingly)
app.use('/api', require('./routes'));

db.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`✅ DB Connected and server running on port ${port}`);
    });
  }
});

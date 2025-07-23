const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // ✅ Required for proper CORS handling
const db = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();
const port = process.env.PORT || 3000;

// ✅ Use CORS middleware
app.use(cors());

// ✅ Optional: Also keep your manual fallback (not required if using app.use(cors()))
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next();
// });

// Middleware to parse JSON
app.use(bodyParser.json());

// ✅ Redirect root to Swagger docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// ✅ Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ API routes
app.use('/api', require('./routes'));

// ✅ Connect to DB and start server
db.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`✅ DB Connected and server running on port ${port}`);
    });
  }
});

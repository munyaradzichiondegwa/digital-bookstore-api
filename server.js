const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const db = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
require('dotenv').config(); // Load environment variables

// Load GitHub Strategy setup
require('./auth/passport-setup'); // Contains Passport GitHub strategy config

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// === Swagger UI ===
// Redirect root to API documentation for user-friendliness
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// === App Routes ===
// The main router in 'routes/index.js' now handles all endpoints,
// including '/auth', '/books', and '/authors'.
app.use('/', require('./routes'));

// === DB Connection & Server Start ===
db.initDb((err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    app.listen(port, () => {
      console.log(`✅ DB Connected and server running on port ${port}`);
    });
  }
});
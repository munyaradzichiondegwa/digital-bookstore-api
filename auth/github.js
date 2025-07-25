const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

const router = express.Router();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://digital-bookstore-api.onrender.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // Handle GitHub user data here — e.g., find/create user in DB
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// GitHub login route
router.get('/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

// GitHub callback route
router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/docs'); // or redirect to a frontend/dashboard
  });

module.exports = router;

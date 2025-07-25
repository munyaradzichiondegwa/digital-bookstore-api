const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route to start the GitHub authentication process
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }), // Redirect to docs on failure
  (req, res) => {
    // On successful authentication, redirect to a success page or back to the docs
    res.redirect('/api-docs');
  }
);

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    // On successful logout, you can redirect or send a confirmation message
    res.redirect('/');
  });
});

module.exports = router;
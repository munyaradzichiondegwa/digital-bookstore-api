const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // If not authenticated, send an unauthorized status
  // You could also redirect to the login page
  res.status(401).json({ message: 'Unauthorized. Please log in to access this resource.' });
};

module.exports = { ensureAuth };
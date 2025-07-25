const express = require('express');
const router = express.Router();

const authorsController = require('../controllers/authors');
const { authorValidationRules, validate } = require('../validation/validator');
const { ensureAuth } = require('../middleware/auth-check'); // Import the middleware

// Public routes: Anyone can view all authors or a single author
router.get('/', authorsController.getAllAuthors);
router.get('/:id', authorsController.getSingleAuthor);

// Protected routes: User must be authenticated to create, update, or delete authors
// Apply ensureAuth middleware before validation and controller logic
router.post('/', ensureAuth, authorValidationRules(), validate, authorsController.createAuthor);
router.put('/:id', ensureAuth, authorValidationRules(), validate, authorsController.updateAuthor);
router.delete('/:id', ensureAuth, authorsController.deleteAuthor);

module.exports = router;
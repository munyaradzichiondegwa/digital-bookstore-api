const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');
const { bookValidationRules, validate } = require('../validation/validator');
const { ensureAuth } = require('../middleware/auth-check'); // Import the middleware

// Public routes: Anyone can view all books or a single book
router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getSingleBook);

// Protected routes: User must be authenticated to create, update, or delete books
// Apply ensureAuth middleware before validation and controller logic
router.post('/', ensureAuth, bookValidationRules(), validate, booksController.createBook);
router.put('/:id', ensureAuth, bookValidationRules(), validate, booksController.updateBook);
router.delete('/:id', ensureAuth, booksController.deleteBook);

module.exports = router;
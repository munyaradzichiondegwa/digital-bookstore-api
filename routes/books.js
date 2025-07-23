const express = require('express');
const router = express.Router();

const booksController = require('../controllers/books');
const { bookValidationRules, validate } = require('../validation/validator');

router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getSingleBook);

// Apply validation middleware to POST route
router.post('/', bookValidationRules(), validate, booksController.createBook);

// Apply validation middleware to PUT route
router.put('/:id', bookValidationRules(), validate, booksController.updateBook);

router.delete('/:id', booksController.deleteBook);

module.exports = router;
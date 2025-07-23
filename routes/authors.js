const express = require('express');
const router = express.Router();

const authorsController = require('../controllers/authors');
const { authorValidationRules, validate } = require('../validation/validator');

router.get('/', authorsController.getAllAuthors);
router.get('/:id', authorsController.getSingleAuthor);
router.post('/', authorValidationRules(), validate, authorsController.createAuthor);
router.put('/:id', authorValidationRules(), validate, authorsController.updateAuthor);
router.delete('/:id', authorsController.deleteAuthor);

module.exports = router;
const { body, validationResult } = require('express-validator');

// Book validation rules
const bookValidationRules = () => {
  return [
    body('title')
      .isString()
      .notEmpty()
      .withMessage('Title is required and must be a string.'),
    body('publicationYear')
      .isNumeric()
      .withMessage('Publication year must be a number.'),
    body('genre')
      .isString()
      .notEmpty()
      .withMessage('Genre is required.'),
    body('isbn')
      .isISBN()
      .withMessage('A valid ISBN is required.'),
    body('pageCount')
      .isNumeric()
      .withMessage('Page count must be a number.'),
    body('summary')
      .isLength({ min: 10 })
      .withMessage('Summary must be at least 10 characters long.')
  ];
};

// Author validation rules
const authorValidationRules = () => {
  return [
    body('firstName')
      .isString()
      .notEmpty()
      .withMessage('First name is required.'),
    body('lastName')
      .isString()
      .notEmpty()
      .withMessage('Last name is required.'),
    body('birthYear')
      .isNumeric()
      .withMessage('Birth year must be a number.'),
    body('nationality')
      .isString()
      .notEmpty()
      .withMessage('Nationality is required.')
  ];
};

// Shared validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().forEach(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  bookValidationRules,
  authorValidationRules,
  validate,
};

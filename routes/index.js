const express = require('express');
const router = express.Router();

router.use('/books', require('./books'));
// author routes will be added later
router.use('/authors', require('./authors'));

module.exports = router;
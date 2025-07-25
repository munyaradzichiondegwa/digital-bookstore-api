const { ObjectId } = require('mongodb');
const db = require('../db/connect');

// GET /books - Retrieve all books
const getAllBooks = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Get all books'
  // #swagger.description = 'Retrieves a list of all books from the database.'
  try {
    const result = await db.getDb().collection('books').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /books/{id} - Retrieve a single book
const getSingleBook = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Get a single book by ID'
  // #swagger.description = 'Retrieves a single book using its unique MongoDB ObjectId.'
  // #swagger.parameters['id'] = { description: 'Book ID', required: true }
  try {
    const bookId = new ObjectId(req.params.id);
    const result = await db.getDb().collection('books').find({ _id: bookId });
    const lists = await result.toArray();
    if (lists.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /books - Create a new book
const createBook = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Create a new book'
  // #swagger.description = 'Creates a new book in the database. Requires authentication.'
  // #swagger.security = [{ "github_oauth": [] }]
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'The book data to create.',
        required: true,
        schema: { $ref: "#/definitions/BookInput" }
  } */
  try {
    const book = {
      title: req.body.title,
      authorId: new ObjectId(req.body.authorId),
      publicationYear: req.body.publicationYear,
      genre: req.body.genre,
      isbn: req.body.isbn,
      publisher: req.body.publisher,
      pageCount: req.body.pageCount,
      coverType: req.body.coverType,
      summary: req.body.summary
    };
    const response = await db.getDb().collection('books').insertOne(book);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Book created successfully', bookId: response.insertedId });
    } else {
      res.status(500).json({ message: 'An error occurred while creating the book.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /books/{id} - Update a book
const updateBook = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Update an existing book'
  // #swagger.description = 'Updates an existing book by its ID. Requires authentication.'
  // #swagger.security = [{ "github_oauth": [] }]
  // #swagger.parameters['id'] = { description: 'Book ID', required: true }
  /*  #swagger.parameters['obj'] = {
        in: 'body',
        description: 'The book data to update.',
        required: true,
        schema: { $ref: "#/definitions/BookInput" }
  } */
  try {
    const bookId = new ObjectId(req.params.id);
    const book = {
      title: req.body.title,
      authorId: new ObjectId(req.body.authorId),
      publicationYear: req.body.publicationYear,
      genre: req.body.genre,
      isbn: req.body.isbn,
      publisher: req.body.publisher,
      pageCount: req.body.pageCount,
      coverType: req.body.coverType,
      summary: req.body.summary
    };
    const response = await db.getDb().collection('books').replaceOne({ _id: bookId }, book);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
        const existingBook = await db.getDb().collection('books').findOne({ _id: bookId });
        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(204).send();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /books/{id} - Delete a book
const deleteBook = async (req, res) => {
  // #swagger.tags = ['Books']
  // #swagger.summary = 'Delete a book'
  // #swagger.description = 'Deletes a book by its ID. Requires authentication.'
  // #swagger.security = [{ "github_oauth": [] }]
  // #swagger.parameters['id'] = { description: 'Book ID', required: true }
  try {
    const bookId = new ObjectId(req.params.id);
    const response = await db.getDb().collection('books').deleteOne({ _id: bookId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllBooks,
  getSingleBook,
  createBook,
  updateBook,
  deleteBook
};
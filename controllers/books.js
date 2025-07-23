const { ObjectId } = require('mongodb');
const db = require('../db/connect');

// GET /books - Retrieve all books
const getAllBooks = async (req, res) => {
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
  try {
    const book = {
      title: req.body.title,
      authorId: new ObjectId(req.body.authorId), // Assuming authorId is provided
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
        // This could mean the book was not found or the data was the same
        const existingBook = await db.getDb().collection('books').findOne({ _id: bookId });
        if (!existingBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(204).send(); // Data was the same, but request is successful
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /books/{id} - Delete a book
const deleteBook = async (req, res) => {
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
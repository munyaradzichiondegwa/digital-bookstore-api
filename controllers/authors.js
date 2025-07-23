const { ObjectId } = require('mongodb');
const db = require('../db/connect');

// GET /authors - Retrieve all authors
const getAllAuthors = async (req, res) => {
  try {
    const result = await db.getDb().collection('authors').find();
    const lists = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /authors/{id} - Retrieve a single author
const getSingleAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const result = await db.getDb().collection('authors').find({ _id: authorId });
    const lists = await result.toArray();
    if (lists.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    } else {
      res.status(404).json({ message: 'Author not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /authors - Create a new author
const createAuthor = async (req, res) => {
  try {
    const author = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthYear: req.body.birthYear,
      nationality: req.body.nationality
    };
    const response = await db.getDb().collection('authors').insertOne(author);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Author created successfully', authorId: response.insertedId });
    } else {
      res.status(500).json({ message: 'An error occurred while creating the author.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /authors/{id} - Update an author
const updateAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const author = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthYear: req.body.birthYear,
      nationality: req.body.nationality
    };
    const response = await db.getDb().collection('authors').replaceOne({ _id: authorId }, author);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
        const existingAuthor = await db.getDb().collection('authors').findOne({ _id: authorId });
        if (!existingAuthor) {
            return res.status(404).json({ message: 'Author not found' });
        }
        res.status(204).send();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /authors/{id} - Delete an author
const deleteAuthor = async (req, res) => {
  try {
    const authorId = new ObjectId(req.params.id);
    const response = await db.getDb().collection('authors').deleteOne({ _id: authorId });
    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Author deleted successfully' });
    } else {
      res.status(404).json({ message: 'Author not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllAuthors,
  getSingleAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
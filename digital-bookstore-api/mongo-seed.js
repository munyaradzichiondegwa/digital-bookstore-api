// mongo-seed.js

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// --- DATA TO BE INSERTED ---

// Note: The 'id' field is a temporary, script-local identifier to link authors to books.
// It will not be inserted into the database.
const authorsData = [
  { id: 'frank_herbert', firstName: 'Frank', lastName: 'Herbert', birthYear: 1920, nationality: 'American' },
  { id: 'jrr_tolkien', firstName: 'J.R.R.', lastName: 'Tolkien', birthYear: 1892, nationality: 'British' },
  { id: 'george_orwell', firstName: 'George', lastName: 'Orwell', birthYear: 1903, nationality: 'British' },
  { id: 'jane_austen', firstName: 'Jane', lastName: 'Austen', birthYear: 1775, nationality: 'English' },
  { id: 'harper_lee', firstName: 'Harper', lastName: 'Lee', birthYear: 1926, nationality: 'American' },
  { id: 'f_scott_fitzgerald', firstName: 'F. Scott', lastName: 'Fitzgerald', birthYear: 1896, nationality: 'American' },
  { id: 'yuval_noah_harari', firstName: 'Yuval Noah', lastName: 'Harari', birthYear: 1976, nationality: 'Israeli' },
  { id: 'douglas_adams', firstName: 'Douglas', lastName: 'Adams', birthYear: 1952, nationality: 'British' },
  { id: 'stephen_hawking', firstName: 'Stephen', lastName: 'Hawking', birthYear: 1942, nationality: 'British' },
  { id: 'jd_salinger', firstName: 'J.D.', lastName: 'Salinger', birthYear: 1919, nationality: 'American' }
];

const booksData = [
  { title: 'Dune', authorId: 'frank_herbert', publicationYear: 1965, genre: 'Science Fiction', isbn: '9780441013593', publisher: 'Chilton Books', pageCount: 412, coverType: 'Hardcover', summary: "Set in the distant future amidst a feudal interstellar society, Dune tells the story of young Paul Atreides, whose family accepts stewardship of the desert planet Arrakis." },
  { title: 'The Hobbit', authorId: 'jrr_tolkien', publicationYear: 1937, genre: 'Fantasy', isbn: '9780618260300', publisher: 'George Allen & Unwin', pageCount: 310, coverType: 'Paperback', summary: "A reluctant hobbit, Bilbo Baggins, sets out to the Lonely Mountain with a spirited group of dwarves to reclaim their mountain home from the dragon Smaug." },
  { title: '1984', authorId: 'george_orwell', publicationYear: 1949, genre: 'Dystopian', isbn: '9780451524935', publisher: 'Secker & Warburg', pageCount: 328, coverType: 'Paperback', summary: "A novel set in a totalitarian society under constant surveillance by 'Big Brother', where a low-ranking party member questions the regime." },
  { title: 'Pride and Prejudice', authorId: 'jane_austen', publicationYear: 1813, genre: 'Romance', isbn: '9781503290563', publisher: 'T. Egerton, Whitehall', pageCount: 279, coverType: 'Hardcover', summary: "This classic novel follows the turbulent relationship between Elizabeth Bennet and Fitzwilliam Darcy, a rich aristocratic landowner." },
  { title: 'To Kill a Mockingbird', authorId: 'harper_lee', publicationYear: 1960, genre: 'Southern Gothic', isbn: '9780061120084', publisher: 'J. B. Lippincott & Co.', pageCount: 324, coverType: 'Paperback', summary: "The story is told through the eyes of Scout Finch, as her lawyer father, Atticus, defends a black man falsely accused of raping a white woman." },
  { title: 'The Great Gatsby', authorId: 'f_scott_fitzgerald', publicationYear: 1925, genre: 'Modernist', isbn: '9780743273565', publisher: "Charles Scribner's Sons", pageCount: 180, coverType: 'Paperback', summary: "A novel about the mysterious millionaire Jay Gatsby and his obsessive love for Daisy Buchanan, set during the Roaring Twenties." },
  { title: 'Sapiens: A Brief History of Humankind', authorId: 'yuval_noah_harari', publicationYear: 2011, genre: 'Non-fiction', isbn: '9780062316097', publisher: 'Dvir Publishing House', pageCount: 443, coverType: 'eBook', summary: "An exploration of the history of Homo sapiens, from the Stone Age to the political and technological revolutions of the 21st century." },
  { title: 'The Hitchhiker\'s Guide to the Galaxy', authorId: 'douglas_adams', publicationYear: 1979, genre: 'Science Fiction Comedy', isbn: '9780345391803', publisher: 'Pan Books', pageCount: 193, coverType: 'Paperback', summary: "The misadventures of the last surviving man, Arthur Dent, following the demolition of the Earth by a Vogon constructor fleet." },
  { title: 'A Brief History of Time', authorId: 'stephen_hawking', publicationYear: 1988, genre: 'Popular Science', isbn: '9780553380163', publisher: 'Bantam Dell Publishing Group', pageCount: 212, coverType: 'Hardcover', summary: "A landmark volume in science writing, the book explores the origins of the universe and the nature of time, from the big bang to black holes." },
  { title: 'The Catcher in the Rye', authorId: 'jd_salinger', publicationYear: 1951, genre: 'Coming-of-age', isbn: '9780316769488', publisher: 'Little, Brown and Company', pageCount: 224, coverType: 'Paperback', summary: "The novel details two days in the life of 16-year-old Holden Caulfield after he has been expelled from prep school." }
];

// --- SCRIPT LOGIC ---

async function seedDB() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log('Connecting to the database...');
    await client.connect();
    console.log('Successfully connected to the database.');

    // Use the database specified in your MONGODB_URI or a default
    const db = client.db();

    const authorsCollection = db.collection('authors');
    const booksCollection = db.collection('books');

    // Clear existing data
    console.log('Clearing existing authors and books collections...');
    await authorsCollection.deleteMany({});
    await booksCollection.deleteMany({});
    console.log('Collections cleared.');

    // Prepare author data by removing the temporary 'id' field
    const authorsToInsert = authorsData.map(({ id, ...rest }) => rest);
    
    // Insert authors
    console.log('Inserting authors...');
    const insertedAuthorsResult = await authorsCollection.insertMany(authorsToInsert);
    console.log(`${insertedAuthorsResult.insertedCount} authors have been inserted.`);

    // Create a map of our temporary IDs to the new MongoDB ObjectIds
    const authorIdMap = {};
    authorsData.forEach((author, index) => {
      // The insertedIds object from insertMany gives us the _id for each document by its original index
      authorIdMap[author.id] = insertedAuthorsResult.insertedIds[index];
    });

    // Prepare book data by replacing the temporary authorId with the real ObjectId
    const booksToInsert = booksData.map(book => {
      return {
        ...book,
        authorId: authorIdMap[book.authorId] // Replace string ID with MongoDB ObjectId
      };
    });

    // Insert books
    console.log('Inserting books...');
    const insertedBooksResult = await booksCollection.insertMany(booksToInsert);
    console.log(`${insertedBooksResult.insertedCount} books have been inserted.`);

    console.log('\nDatabase has been successfully seeded! ✅');

  } catch (error) {
    console.error('An error occurred during the seeding process:');
    console.error(error);
  } finally {
    // Ensure the client will close when you finish/error
    await client.close();
    console.log('Database connection closed.');
  }
}

// Run the seeding function
seedDB();
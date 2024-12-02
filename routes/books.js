const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Genre = require('../models/genre');
const BookGenre = require('../models/bookGenre');

// Pobierz wszystkie książki z ich gatunkami
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    const booksWithGenres = [];

    for (let book of books) {
      const genres = await BookGenre.find({ book_id: book._id }).populate('genre_id', 'name');
      booksWithGenres.push({
        ...book.toObject(),
        genres: genres.map(g => g.genre_id.name)
      });
    }

    res.json(booksWithGenres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/search', async (req, res) => {
  const { name, author, rating, status, genre } = req.body;

  try {
    // Build dynamic query
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (author) query.author = { $regex: author, $options: 'i' };
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (status) query.status = status;

    // Fetch books matching query
    const books = await Book.find(query);
    
    // Fetch genres for each book and add them to the books
    const booksWithGenres = [];
    for (let book of books) {
      const genres = await BookGenre.find({ book_id: book._id }).populate('genre_id', 'name');
      booksWithGenres.push({
        ...book.toObject(),
        genres: genres.map(g => g.genre_id.name)
      });
    }

    // If genre is specified, filter books by genre
    let filteredBooks = booksWithGenres;
    if (genre) {
      const genreData = await Genre.findOne({ name: genre });
      if (genreData) {
        filteredBooks = filteredBooks.filter(book =>
          book.genres.includes(genreData.name)
        );
      }
    }

    res.json(filteredBooks);
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Dodaj nową książkę
router.post('/', async (req, res) => {
  console.log("body: ", req.body);
  const { name, author, year, rating, status, genres } = req.body;

  try {
    // Utwórz nową książkę
    const book = new Book({
      name,
      author,
      year,
      rating: status === 'read' ? rating : null,
      status: status || 'not started',  // Jeśli status nie został podany, użyj domyślnego
    });

    const savedBook = await book.save();

    if (genres) {
      // Znajdź gatunki na podstawie nazw
      const genreDocs = await Genre.find({ name: { $in: genres } });

      if (genreDocs.length !== genres.length) {
        return res.status(400).json({ message: 'Niektóre gatunki nie istnieją' });
      }
  
      // Zapisz połączenie książki z gatunkami
      const bookGenres = genreDocs.map(genre => ({
        book_id: savedBook._id,
        genre_id: genre._id
      }));
      await BookGenre.insertMany(bookGenres);
    }

    res.status(201).json(savedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/new', async (req, res) => {
  try {
    const genres = await Genre.find({}, {name: 1, _id: 0});
    const genresArray = genres.map(item => item.name);
    res.render('books/new', { genres: genresArray})
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

module.exports = router;

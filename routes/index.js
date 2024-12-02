const express = require('express')
const router = express.Router()
const Book = require('../models/book');
const Genre = require('../models/genre');
const BookGenre = require('../models/bookGenre');

router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find({}, {name: 1, _id: 0});
        const genresArray = genres.map(item => item.name);
        res.render('index', { genres: genresArray})
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
})

module.exports = router
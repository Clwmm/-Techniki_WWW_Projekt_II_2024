const express = require('express');
const router = express.Router();
const Genre = require('../models/genre');

router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find({}, {name: 1, _id: 0});
    const genresArray = genres.map(item => item.name);
    res.json(genresArray);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  console.log(req.body);
  const { name } = req.body;

  try {
    const genre = new Genre({ name });
    const newGenre = await genre.save();
    res.redirect('/genres/new');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/new', async (req, res) => {
  try {
    const genres = await Genre.find({}, {name: 1, _id: 0});
    const genresArray = genres.map(item => item.name);
    res.render('genres/new', { genres: genresArray})
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

module.exports = router;

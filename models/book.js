const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true},
  author: { type: String, required: true },
  year: { type: Number, required: true },
  rating: { type: Number, min: 0, max: 10, default: null },
  status: { 
    type: String, 
    enum: ['read', 'in progress', 'not started'], // Możliwe statusy książki
    default: 'not started' // Domyślny status
  }
});

module.exports = mongoose.model('Book', BookSchema);

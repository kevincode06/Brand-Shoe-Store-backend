const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
  name: String,
  brand: { type: String, enum: ['Nike', 'Adidas', 'Puma'] },
  price: Number,
  imageUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Shoe', shoeSchema);

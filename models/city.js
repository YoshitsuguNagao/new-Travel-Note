const mongoose = require('mongoose');

const { Schema } = mongoose;

const citySchema = new Schema({
  country: String,
  name: String,
  lat: String,
  lng: String,
});

const City = mongoose.model('City', citySchema);

module.exports = City;

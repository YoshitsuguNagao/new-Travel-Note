const mongoose = require('mongoose');

const { Schema } = mongoose;

const tripSchema = new Schema({
  city: String,
  ownerId: String,
}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;

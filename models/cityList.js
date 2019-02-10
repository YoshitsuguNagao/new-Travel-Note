const mongoose = require('mongoose');

const { Schema } = mongoose;

const cityListSchema = new Schema({
  cityName: String,
  cityId: String,
  domesticFlag: String,
});

const CityList = mongoose.model('CityList', cityListSchema);

module.exports = CityList;

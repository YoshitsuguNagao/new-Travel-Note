const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const tripSchema = new Schema({
  city: String,
  owner: { type: ObjectId, ref: 'User' },
  cost: {
    budget: Number,
    flightCost: Number,
    accommodationCost: Number,
  },
  flight: {
    aTimeUTC: Number,
    dTimeUTC: Number,
    aTime: Number,
    dTime: Number,
    airlines: [String],
    flyFrom: String,
    flyTo: String,
    cityFrom: String,
    cityTo: String,
    mapIdto: String,
    mapIdfrom: String,
    countryFrom: { code: String, name: String },
    countryTo: { code: String, name: String },
    price: Number,
    distance: Number,
    fly_duration: String,
    return_duration: String,
    duration: { total: Number, return: Number, departure: Number },
    routes: [[String]],
    route: [{
      aTimeUTC: Number,
      dTimeUTC: Number,
      aTime: Number,
      dTime: Number,
      airline: String,
      flight_no: Number,
      flyFrom: String,
      flyTo: String,
      cityFrom: String,
      cityTo: String,
      mapIdfrom: String,
      mapIdto: String,
    }],
  },
  accommodation: {
    data1: {
      accommodationId: String,
    },
    data2: {
      value: {
        hotel_geo_node: {
          name: String,
        },
        hotel_data_node: {
          rating: Number,
        },
      },
    },
  },
  // },
}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;

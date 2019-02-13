const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const tripSchema = new Schema({
  city: String,
  departureDate: String,
  returnDate: String,
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
      info: {
        value: {
          pah: Number,
          sf: String,
          ho: String,
          ibp: String,
          fc: Number,
          rowid: String,
          fcdt: String,
          egc: Number,
          mp_wt: Number,
          op: Number,
          op_wt: Number,
          fc_days: Number,
          spf: Number,
          mp: Number,
        },
      },
    },
    data2: {
      value: {
        hotel_geo_node: {
          name: String,
          tags: {
            property_type: [String],
          },
          location: {
            lat: Number,
            long: Number,
          },
          _id: Number,
        },
        hotel_data_node: {
          rating: Number,
          name: String,
          contact: {
            phone: [String],
          },
          desc: {
            default: String,
          },
          _id: Number,
          loc: {
            city: String,
            full: String,
            city_cids: {
              voy: Number,
              exp: String,
            },
            pin: String,
            country: String,
            long: Number,
            cnt_code: String,
            lat: Number,
            nhood: [
              {
                _id: Number,
                t: Number,
                n: String,
              },
            ],
          },
        },
      },
    },
  },
  activity: {
    name: String,
    type: [String],
    vicinity: String,
    rating: Number,
  },
  // },
}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;

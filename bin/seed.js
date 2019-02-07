const mongoose = require('mongoose');
const City = require('../models/city');

const cities = [
  {
    country: 'AD',
    name: 'Sant Julià de Lòria',
    lat: '42.46372',
    lng: '1.49129',
  },
  {
    country: 'AD',
    name: 'Pas de la Casa',
    lat: '42.54277',
    lng: '1.73361',
  },
  {
    country: 'AD',
    name: 'Ordino',
    lat: '42.55623',
    lng: '1.53319',
  },
];

mongoose.connect('mongodb://localhost:27017/travel-note', { useNewUrlParser: true })
  .then(() => {
    console.log('connected to db');
    return City.create(cities);
  }).then((data) => {
    console.log('created data', data);
  }).then(() => {
    mongoose.connection.close();
  })
  .catch((error) => {
    console.log(error);
    mongoose.connection.close();
  });

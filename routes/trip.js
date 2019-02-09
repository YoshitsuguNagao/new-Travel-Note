const express = require('express');
const mongoose = require('mongoose');
const Trip = require('../models/trip');
const City = require('../models/city');

const { ObjectId } = mongoose.Types;

const router = express.Router();


router.get('/', (req, res, next) => {
  // res.send('respond with a resource');
  // res.render('trip', { data })
  console.log("I am in get /trip")
  // City.find({})
  //   .then((cities) => {
  //     const num = Math.floor(Math.random() * cities.length);
  //     const city = cities[num];
  //     res.render('trip', { city });
  //   })
  //   .catch(next);
});

router.post('/', (req, res, next) => {
  const { city } = req.body;
  Trip.create({ city, owner: req.session.currentUser._id })
    .then(() => {
      res.redirect('trip/my-trips');
    })
    .catch(next);
});


router.get('/my-trips', (req, res, next) => {
  const { _id } = req.session.currentUser;
  Trip.find({ owner: ObjectId(_id) })
    .then((trips) => {
      console.log(trips);
      res.render('my-trips', { trips });
    })
    .catch(next);
});

router.get('/my-trips/:id', (req, res, next) => {
  const { id } = req.params;
  Trip.findById(id)
    .then((trip) => {
      res.render('trip-details', { trip });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/my-trips/:id/delete', (req, res, next) => {
  const { id } = req.params;
  Trip.findByIdAndDelete(id)
    .then((trip) => {
      res.redirect('/trip/my-trips');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;

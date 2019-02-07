const express = require('express');
const mongoose = require('mongoose');
const Trip = require('../models/trip');

const { ObjectId } = mongoose.Types;

const router = express.Router();

router.get('/', (req, res, next) => {
  const { _id } = req.session.currentUser;
  Trip.find({ owner: ObjectId(_id) })
    .then((trips) => {
      console.log(trips);
      res.render('my-trips', { trips });
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Trip.findById(id)
    .then((trip) => {
      res.render('trip-details', { trip });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/:id/delete', (req, res, next) => {
  const { id } = req.params;
  Trip.findByIdAndDelete(id)
    .then((trip) => {
      res.redirect('/my-trips');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;

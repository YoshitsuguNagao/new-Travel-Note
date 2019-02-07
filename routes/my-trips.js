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

module.exports = router;

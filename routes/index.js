const express = require('express');
const City = require('../models/city');
const Trip = require('../models/trip');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  // console.log(req.session.currentUser);
  res.render('index', { title: 'Travel Note' });
});

router.get('/trip', (req, res, next) => {
  // res.send('respond with a resource');
  City.find({})
    .then((cities) => {
      const num = Math.floor(Math.random() * cities.length);
      const city = cities[num];
      res.render('trip', { city });
    })
    .catch(next);
});

router.post('/trip', (req, res, next) => {
  const { city } = req.body;
  Trip.create({ city, owner: req.session.currentUser._id })
    .then(() => {
    console.log("ok2")

      res.redirect('my-trips');
    })
    .catch(next);
});

module.exports = router;

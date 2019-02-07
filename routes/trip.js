const express = require('express');
const City = require('../models/city');
const Trip = require('../models/trip');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  // res.send('respond with a resource');
  City.find({})
    .then((cities) => {
      const num = Math.floor(Math.random() * cities.length);
      const city = cities[num];
      res.render('trip', { city });
    })
    .catch(next);
});

router.post('/', (req, res, next) =>{
  const { city } = req.body;
  // console.log(req.session.currentUser._id)
  Trip.create({ city, owner: req.session.currentUser._id })
  // .then(() => {


  // })
});
module.exports = router;

const express = require('express');
const City = require('../models/city');

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

module.exports = router;

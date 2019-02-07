const express = require('express');
const cities = require('/city/cities');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  // res.send('respond with a resource');
  res.render('trip');
});

module.exports = router;

const express = require('express');
const axios = require('axios');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  axios.get('https://api.skypicker.com/flights?fly_from=BCN')
    .then(({ data }) => {
      console.log('vuelos', data);
      
      res.render('trip');
    })
    .catch((error) => {
      console.log('error', error);
    });
});

module.exports = router;
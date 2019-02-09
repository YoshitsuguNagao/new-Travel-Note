const express = require('express');
const axios = require('axios');
const dateFormatChanger = require('../public/javascripts/dateFormatChanger')


const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  const { date_from, date_to, budget } = req.body;
  axios.get(`https://api.skypicker.com/flights?fly_from=BCN&date_from=${date_from}`)
    .then(({ data }) => {
      console.log('vuelos', data);
      
      // res.render('trip');
    })
    .catch((error) => {
      console.log('error', error);
    });
});

router.post('/', (req, res, next) => {
  const { date_from, date_to, budget } = req.body;
  console.log(budget);
  console.log(dateFormatChanger(date_from));
  axios.get(`https://api.skypicker.com/flights?fly_from=BCN&date_from=${dateFormatChanger(date_from)}&curr=EUR&price_to=${budget}`)
    .then((apiDataKiwi) => {
      console.log(apiDataKiwi.data); 
    })
    .then(() => {
      res.redirect('/trip');
    })
    .catch(next);
});


module.exports = router;
const express = require('express');
const axios = require('axios');
const dateFormatChanger = require('../public/javascripts/dateFormatChanger');
const CityList = require('../models/cityList');
const getKiwiData = require('../middlwwares/getKiwiData');

const router = express.Router();

/* GET users listing. */
router.post('/', async (req, res, next) => {
  try {
    const { date_from, date_to, budget } = req.body;
    console.log(budget);
    console.log(dateFormatChanger(date_from));
    const cityList = await CityList.find();
    const getFlightInfo = await axios.get(`https://api.skypicker.com/flights?fly_from=BCN&date_from=${dateFormatChanger(date_from)}&curr=EUR&price_to=${budget}`);
    const selectedFlightInfo = [];
    await getFlightInfo.data.data.forEach((oneFlightData) => {
      const cityExist = cityList.some(city => city.cityName === oneFlightData.cityTo);
      if (cityExist) {
        selectedFlightInfo.push(oneFlightData);
      }
    });
    console.log('Im array22');
    const flightData = await selectedFlightInfo[Math.floor(Math.random() * selectedFlightInfo.length)];
    console.log('Im array33', flightData);
    const cityName = flightData.cityTo;
    const cityId = await CityList.findOne({ cityName }, { cityId: 1, _id: 0 });
    console.log('cityId:', cityId);
    const data = { flightData, accommodationData: 'test city' };

    res.render('trip', {
      data,
      date_from,
      date_to,
      budget,
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;

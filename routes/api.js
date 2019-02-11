const express = require('express');
const axios = require('axios');
const dateFormatChanger = require('../public/javascripts/dateFormatChanger');
const getDuration = require('../public/javascripts/getDuration');
const CityList = require('../models/cityList');

const router = express.Router();

/* GET users listing. */
router.post('/', async (req, res, next) => {
  try {
    const { date_from, date_to, budget } = req.body;
    const tripDuration = getDuration(date_from, date_to);
    const dateFrom = date_from.replace('-', '').replace('-', '');
    const dateTo = date_to.replace('-', '').replace('-', '');
    const cityList = await CityList.find();

    const getFlightInfo = await axios.get(`https://api.skypicker.com/flights?fly_from=BCN&date_from=${dateFormatChanger(date_from)}&nights_in_dst_from=${tripDuration}&nights_in_dst_to=${tripDuration}&curr=EUR&price_to=${budget}`);
    const selectedFlightInfo = [];
    await getFlightInfo.data.data.forEach((oneFlightData) => {
      const cityExist = cityList.some(city => city.cityName === oneFlightData.cityTo);
      if (cityExist) {
        selectedFlightInfo.push(oneFlightData);
      }
    });
    const flightData = await selectedFlightInfo[Math.floor(Math.random() * selectedFlightInfo.length)];

    const cityName = flightData.cityTo;
    const cityInfo = await CityList.findOne({ cityName }, { cityId: 1, _id: 0 });
    // console.log('cityId:', cityInfo, 'cityname:', cityName);
    const getAccommodationList = await axios.get(`http://developer.goibibo.com/api/cyclone/?app_id=${process.env.APP_IP}&app_key=${process.env.APP_KEY}&city_id=${cityInfo.cityId}&check_in=${dateFrom}&check_out=${dateTo}`);
    const accommodationIdList = Object.keys(getAccommodationList.data.data);
    const accommodationId = await accommodationIdList[Math.floor(Math.random() * accommodationIdList.length)];
    const accommodationData1 = Object.getOwnPropertyDescriptor(getAccommodationList.data.data, accommodationId);
    // console.log(accommodationData1);

    const getAccommodationInfo = await axios.get(`http://developer.goibibo.com/api/voyager/get_hotels_by_cityid/?app_id=${process.env.APP_IP}&app_key=${process.env.APP_KEY}&city_id=${cityInfo.cityId}`);
    const accommodationData2 = Object.getOwnPropertyDescriptor(getAccommodationInfo.data.data, accommodationId);
    console.log(accommodationData2);
    const data = { flightData, accommodationData1, accommodationData2 };

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


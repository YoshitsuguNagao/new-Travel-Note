const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Trip = require('../models/trip');
const City = require('../models/city');
const dateFormatChanger = require('../public/javascripts/dateFormatChanger');
const getDuration = require('../public/javascripts/getDuration');
const CityList = require('../models/cityList');

const { ObjectId } = mongoose.Types;

const router = express.Router();


router.get('/', (req, res, next) => {
  // res.send('respond with a resource');
  // res.render('trip', { data })
  console.log("I am in get /trip")
  // City.find({})
  //   .then((cities) => {
  //     const num = Math.floor(Math.random() * cities.length);
  //     const city = cities[num];
  //     res.render('trip', { city });
  //   })
  //   .catch(next);
});


router.post('/', async (req, res, next) => {
  try {
    const { date_from, date_to, budget } = req.body;
    const tripDuration = getDuration(date_from, date_to);
    const dateFrom = date_from.replace(/-/g, '');
    const dateTo = date_to.replace(/-/g, '');
    const cityList = await CityList.find();
    const flightBudget = budget / 2;
    const getFlightInfo = await axios.get(`https://api.skypicker.com/flights?fly_from=BCN&date_from=${dateFormatChanger(date_from)}&nights_in_dst_from=${tripDuration}&nights_in_dst_to=${tripDuration}&curr=EUR&price_to=${flightBudget}`);
    const selectedFlightInfo = [];
    getFlightInfo.data.data.forEach((oneFlightData) => {
      const cityExist = cityList.some(city => city.cityName === oneFlightData.cityTo);
      if (cityExist) {
        selectedFlightInfo.push(oneFlightData);
      }
    });
    const flightData = selectedFlightInfo[Math.floor(Math.random() * selectedFlightInfo.length)];
    const accommodationBudget = budget - flightData.price;

    const cityName = flightData.cityTo;
    const cityInfo = await CityList.findOne({ cityName }, { cityId: 1, _id: 0 });
    console.log('cityId:', cityInfo, 'cityname:', cityName);

    // const start = new Date();
    // const acc = await axios.all([getAccommodationList(cityInfo, dateFrom, dateTo), getAccommodationInfo(cityInfo)])
    //   .then((axios.spread((accommodationList, accommodationInfo) => {
    //     console.log(accommodationList);
    //     console.log(accommodationInfo);
    //     return [accommodationList, accommodationInfo];
    //   })));
    // console.log('axios finnish ', new Date() - start);

    // const accommodationIdList = Object.keys(acc[0].data.data);
    // const accommodationId = accommodationIdList[Math.floor(Math.random() * accommodationIdList.length)];
    // const accommodationData1 = Object.getOwnPropertyDescriptor(acc[0].data.data, accommodationId);
    // console.log(accommodationData1);

    // const accommodationData2 = Object.getOwnPropertyDescriptor(acc[1].data.data, accommodationId);
    // console.log(accommodationData2);

    const getAccommodationList = await axios.get(`http://developer.goibibo.com/api/cyclone/?app_id=${process.env.APP_IP}&app_key=${process.env.APP_KEY}&city_id=${cityInfo.cityId}&check_in=${dateFrom}&check_out=${dateTo}`);
    const accommodationIdList = Object.keys(getAccommodationList.data.data);
    const accommodationId = accommodationIdList[Math.floor(Math.random() * accommodationIdList.length)];
    const accommodationData1 = Object.getOwnPropertyDescriptor(getAccommodationList.data.data, accommodationId);
    console.log(accommodationData1);

    const getAccommodationInfo = await axios.get(`http://developer.goibibo.com/api/voyager/?app_id=${process.env.APP_IP}&app_key=${process.env.APP_KEY}&method=hotels.get_hotels_data&id_list=[${accommodationId}]&id_type=_id`);
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

// function getAccommodationList(cityInfo, dateFrom, dateTo) {
//   return axios.get(`http://developer.goibibo.com/api/cyclone/?app_id=${process.env.APP_IP}&app_key=${process.env.APP_KEY}&city_id=${cityInfo.cityId}&check_in=${dateFrom}&check_out=${dateTo}`);
// }

// function getAccommodationInfo(cityInfo) {
//   return axios.get(`http://developer.goibibo.com/api/voyager/get_hotels_by_cityid/?app_id=${process.env.APP_IP}&app_key=${process.env.APP_KEY}&city_id=${cityInfo.cityId}`);
// }

router.post('/save', (req, res, next) => {
  const { city } = req.body;
  Trip.create({ city, owner: req.session.currentUser._id })
    .then(() => {
      res.redirect('trip/my-trips');
    })
    .catch(next);
});


router.get('/my-trips', (req, res, next) => {
  const { _id } = req.session.currentUser;
  Trip.find({ owner: ObjectId(_id) })
    .then((trips) => {
      console.log(trips);
      res.render('my-trips', { trips });
    })
    .catch(next);
});

router.get('/my-trips/:id', (req, res, next) => {
  const { id } = req.params;
  Trip.findById(id)
    .then((trip) => {
      res.render('trip-details', { trip });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/my-trips/:id/delete', (req, res, next) => {
  const { id } = req.params;
  Trip.findByIdAndDelete(id)
    .then((trip) => {
      res.redirect('/trip/my-trips');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;

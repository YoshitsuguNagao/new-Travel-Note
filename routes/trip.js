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
  console.log('I am in get /trip');
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
    const {
      departureDate, returnDate, budget, departureCity,
    } = req.body;
    const dateUnixFrom = new Date(departureDate);
    const dateUnixTo = new Date(returnDate);
    if (dateUnixFrom > dateUnixTo) {
      req.flash('info', 'Change your return date!');
      res.redirect('/home');
      return;
    }
    console.log(departureDate)
    console.log('departure city', departureCity);
    const tripDuration = getDuration(departureDate, returnDate);
    const departureDateForFlight = dateFormatChanger(departureDate);
    const returnDateForFlight = dateFormatChanger(returnDate);
    const departureDateForAccommodation = departureDate.replace(/-/g, '');
    const returnDateForAccommodation = returnDate.replace(/-/g, '');
    const cityList = await CityList.find();

    /* Get flight info */
    const flightBudget = budget / 2;
    const getFlightInfo = await axios.get(`https://api.skypicker.com/flights?fly_from=${departureCity}&date_from=${departureDateForFlight}&date_to=${departureDateForFlight}&return_from=${returnDateForFlight}&return_to=${returnDateForFlight}&curr=EUR&price_to=${flightBudget}&one_for_city=1&max_stopovers=1`);
    const selectedFlightInfo = [];
    const selectedAccommodationInfo = [];
    getFlightInfo.data.data.forEach((oneFlightData) => {
      const cityExist = cityList.some(city => city.cityName === oneFlightData.cityTo);
      // console.log(oneFlightData.price,':',oneFlightData.cityTo)
      if (cityExist) {
        selectedFlightInfo.push(oneFlightData);
      }
    });
    // console.log("number of flight",selectedFlightInfo.length)
    if (selectedFlightInfo.length < 1) {
      req.flash('info', 'There was no available flight...');
      req.flash('info', 'Search for a different trip!');
      res.redirect('/home');
      return;
    }
    const flightData = selectedFlightInfo[Math.floor(Math.random() * selectedFlightInfo.length)];
    const flightCost = flightData.price;
    console.log('cityTo:', flightData.cityTo);
    /* Get Accommodation info */
    const accommodationBudgetEur = budget - flightCost;
    const cityName = flightData.cityTo;
    const cityInfo = await CityList.findOne({ cityName }, { cityId: 1, _id: 0 });

    // const start = new Date();
    // const acc = await axios.all([getAccommodationList(cityInfo, departureDateForAccommodation, returnDateForAccommodation), getAccommodationInfo(cityInfo)])
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

    const getAccommodationList = await axios.get(`http://developer.goibibo.com/api/cyclone/?app_id=${process.env.APP_IP}&app_key=${process.env.APP_KEY}&city_id=${cityInfo.cityId}&check_in=${departureDateForAccommodation}&check_out=${returnDateForAccommodation}`);
    const accommodationBudgetInr = 79.72 * accommodationBudgetEur / tripDuration;
    const accommodationIdList = Object.keys(getAccommodationList.data.data);

    for (let i = 0; i < accommodationIdList.length; i++) {
      const accommodation = Object.getOwnPropertyDescriptor(getAccommodationList.data.data, accommodationIdList[i]);
      if (accommodation.value.op < accommodationBudgetInr) {
        selectedAccommodationInfo.push({ accommodationId: accommodationIdList[i], info: accommodation });
      }
    }
    if (selectedAccommodationInfo.length < 1) {
      req.flash('info', `We found a flight to ${cityName}.`);
      req.flash('info', `No available accommodation...`);
      req.flash('info', `Search for a different trip!`);
      res.redirect('/home');
      return;
      // return res.redirect('/home');
    }
    const accommodationData1 = selectedAccommodationInfo[Math.floor(Math.random() * selectedAccommodationInfo.length)];
    const getAccommodationInfo = await axios.get(`http://developer.goibibo.com/api/voyager/?app_id=${process.env.APP_IP}&app_key=${process.env.APP_KEY}&method=hotels.get_hotels_data&id_list=[${accommodationData1.accommodationId}]&id_type=_id`);
    const accommodationData2 = Object.getOwnPropertyDescriptor(getAccommodationInfo.data.data, accommodationData1.accommodationId);
    const accommodationCost = Math.ceil(accommodationData1.info.value.op / 79.72 * tripDuration);
    /* Get Activity info */
    const latitude = accommodationData2.value.hotel_geo_node.location.lat;
    const longitude = accommodationData2.value.hotel_geo_node.location.long;

    const amusementParkList = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=amusement_park&key=${process.env.API_ACCOMMODATION_KEY}`);
    // console.log('amusementParkList', amusementParkList.data.results);
    const amusementParkListSorted = amusementParkList.data.results.slice(0, 5);
    // console.log('amusementParkListSorted ', amusementParkListSorted);
    const artGalleryList = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=art_gallery&key=${process.env.API_ACCOMMODATION_KEY}`);
    // console.log('art_galleryList', artGalleryList.data.results);
    const artGalleryListSorted = artGalleryList.data.results.slice(0, 5);
    const churchList = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=church&key=${process.env.API_ACCOMMODATION_KEY}`);
    // console.log('churchList', churchList.data.results);
    const churchListSorted = churchList.data.results.slice(0, 5);
    const parkList = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=park&key=${process.env.API_ACCOMMODATION_KEY}`);
    // console.log('parkList', parkList.data.results);
    const parkListSorted = parkList.data.results.slice(0, 5);
    const nightClubList = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=night_club&key=${process.env.API_ACCOMMODATION_KEY}`);
    // console.log('night_clubList', nightClubList.data.results);
    const nightClubListSorted = nightClubList.data.results.slice(0, 5);

    const activitiesList = [...amusementParkListSorted, ...artGalleryListSorted, ...churchListSorted, parkListSorted, ...nightClubListSorted];
    // console.log('merge activities', activitiesList);
    const activity = activitiesList[(Math.floor(Math.random() * activitiesList.length))];
    console.log('activity', activity);
    // console.log('activity name', activity.name);
    console.log(activitiesList.length);
    const typeArr = activity.types;
    let activitySentence = 'Go the infomation center!';
    if (typeArr.length > 0) {
      for (let i = 0; i < typeArr.length; i++) {
        if (typeArr[i] === 'curch') {
          activitySentence = `Visit the ${activity.name}`;
        } else if (typeArr[i] === 'amusement_park') {
          activitySentence = `Visit the ${activity.name}`;
        } else if (typeArr[i] === 'park') {
          activitySentence = `Walk around ${activity.name}`;
        } else if (typeArr[i] === 'night_club') {
          activitySentence = `Have couple of drinks at ${activity.name}`;
        } else if (typeArr[i] === 'art_gallery') {
          activitySentence = `See some art at ${activity.name}`;
        }
      }
    }

    /* Send info */
    const data = {
      flightData, accommodationData1, accommodationData2, activity,
    };
    const cost = { budget, flightCost, accommodationCost };
    res.render('trip', {
      data,
      departureDate,
      returnDate,
      budget,
      cost,
      activitySentence,
    });
  } catch (error) {
    next(error);
  }
});

// function getAccommodationList(cityInfo, departureDateForAccommodation, returnDateForAccommodation) {
//   return axios.get(`http://developer.goibibo.com/api/cyclone/?app_id=${process.env.APP_IP}&app_key=${process.env.APP_KEY}&city_id=${cityInfo.cityId}&check_in=${departureDateForAccommodation}&check_out=${returnDateForAccommodation}`);
// }

// function getAccommodationInfo(cityInfo) {
//   return axios.get(`http://developer.goibibo.com/api/voyager/get_hotels_by_cityid/?app_id=${process.env.APP_IP}&app_key=${process.env.APP_KEY}&city_id=${cityInfo.cityId}`);
// }

router.post('/save', (req, res, next) => {
  let {
    city, departureDate, returnDate, cost, flightData, accommodationData1, accommodationData2, activity,
  } = req.body;
  cost = JSON.parse(cost);
  flightData = JSON.parse(flightData);
  accommodationData1 = JSON.parse(accommodationData1);
  accommodationData2 = JSON.parse(accommodationData2);
  activity = JSON.parse(activity);
  Trip.create({
    city,
    departureDate,
    returnDate,
    owner: req.session.currentUser._id,
    flight: flightData,
    accommodation: {
      data1: accommodationData1,
      data2: accommodationData2,
    },
    activity,
    cost,
  })
    .then(() => {
      res.redirect('/trip/my-trips');
    })
    .catch(next);
});

router.get('/my-trips', (req, res, next) => {
  const { _id } = req.session.currentUser;
  Trip.find({ owner: ObjectId(_id) })
    .then((trips) => {
      // console.log(trips);
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

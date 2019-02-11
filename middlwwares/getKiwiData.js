const CityList = require('../models/cityList');

const getKiwiData = (req, res, next) => {
  CityList.findOne({ cityName: req.cityTo })
    .then((city) => {
      console.log(city);
      return city;
    })
    .catch(next);
};

module.exports = getKiwiData;

const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  // console.log(req.session.currentUser);
  const currentDate = new Date().toISOString().split('T')[0]
  res.render('home', {
    title: 'Travel Note',
    currentDate,
  });
});


module.exports = router;

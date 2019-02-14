const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  // console.log(req.session.currentUser);

  const currentDate = new Date().toISOString().split('T')[0];
  const msg = req.flash('info');
  console.log(msg);
  res.render('home', {
    errorMessage: msg,
    title: 'Travel Note',
    currentDate,
  });
});


module.exports = router;

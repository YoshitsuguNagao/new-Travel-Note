const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  // res.send('respond with a resource');
  if (req.session.currentUser) {
    res.redirect('home');
  } else {
    res.render('splash');
  }
});

module.exports = router;
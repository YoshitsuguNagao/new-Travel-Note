const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  // console.log(req.session.currentUser);

  res.render('home', { title: 'Travel Note' });
});


module.exports = router;

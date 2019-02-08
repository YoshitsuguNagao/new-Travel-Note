const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user');

const { ObjectId } = mongoose.Types;
const router = express.Router();

const bcryptSalt = 10;

/* GET profile page. */
router.get('/', (req, res, next) => {
  // console.log(req.session.currentUser);

  const { _id } = req.session.currentUser;
  console.log(_id);
  User.findById({ _id: ObjectId(_id) })
    .then((user) => {
      res.render('profile', user);
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { _id } = req.session.currentUser;
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username) {
    User.findByIdAndUpdate( _id, { username })
      .then(() => {
        res.redirect('/profile');
      })
      .catch(next);
  }
  if (password) {
    User.findByIdAndUpdate( _id, { password: hashPass })
      .then(() => {
        res.redirect('/profile');
      })
      .catch(next);
  }
});


module.exports = router;

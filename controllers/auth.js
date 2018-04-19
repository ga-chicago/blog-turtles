const express = require('express');
const router = express.Router();
const User   = require('../models/user');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {

  res.render('auth/login.ejs', {
    message: req.session.message
  });

});


router.post('/login', async (req, res, next) => {


  try {

    const user = await User.findOne({username: req.body.username});
    // if the user is not in the database I believe this returns null

    if(user){

      // now lets compare passworswords
      // this statemenet returns true or false
      if(bcrypt.compareSync(req.body.password, user.password)){

        req.session.logged = true;
        req.session.username = user.username;

        res.redirect('/articles');

      } else {

        req.session.message = 'Username or password is incorrect';
        res.redirect('/');
      }


    } else {
      // if the user is null or undefined
        req.session.message = 'Username or password is incorrect';
        res.redirect('/');
    } // end of if user



  } catch(err){
    next(err)
  }


  req.session.logged = true;
  req.session.username = req.body.username;

  res.redirect('/articles')
})

router.post('/registration', async (req, res, next) => {

  // first thing to do is hash our password
  // const { password } = req.body;
  const password = req.body.password;
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const newUser = {
    username: req.body.username,
    password: passwordHash,
    email: req.body.email
  };

  try {
     const user = await User.create(newUser)
     // if the user was successfully created lets create the session for that user
     if(user){
        req.session.logged = true
        req.session.username = user.username;

        res.redirect('/articles');
     } else {
        req.session.message = 'Sorry I didnt work';
        res.redirect('/')
     }



   } catch (err){
      next(err)
   }



  res.redirect('/articles');
})






module.exports = router;

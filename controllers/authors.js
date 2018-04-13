const express = require('express');
const router = express.Router();
const Authors = require('../models/authors');

router.get('/', (req, res) => {

  Authors.find((err, foundAuthors) => {

    if(err) console.log(err);
    console.log(foundAuthors, ' this is found Authors')

    res.render('authors/index.ejs', {authors: foundAuthors});
  });
});





module.exports = router;

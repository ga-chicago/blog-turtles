const express = require('express');
const app     = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


// run our db file
require('./db/db');

// MIDDLEWARE
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));

// CONTROLLERS
const authorsController = require('./controllers/authors');
app.use('/authors', authorsController);
const articlesController = require('./controllers/articles')
app.use('/articles', articlesController);


app.listen(3000, () => {
  console.log('server is listening on PORT: 3000')
})

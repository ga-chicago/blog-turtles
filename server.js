const express = require('express');
const app     = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


// run our db file
require('./db/db');
const authorsController = require('./controllers/authors');

// MIDDLEWARE
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));

// CONTROLLERS
app.use('/authors', authorsController);



app.listen(3000, () => {
  console.log('server is listening on PORT: 3000')
})

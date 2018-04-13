const express = require('express');
const app     = express();
const bodyParser = require('body-parser');

// run our db file
require('./db/db');
const authorsController = require('./controllers/authors');



app.use(bodyParser.urlencoded({extended: false}));
app.use('/authors', authorsController);




app.listen(3000, () => {
  console.log('server is listening on PORT: 3000')
})

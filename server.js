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

// seeding a database is adding some data to the database so there some data there to work with when you are doing develoipment
app.get('/seed', (req, res) => {
	// Articles.create
	// Articles.create
	// Articles.create
	// Articles.create
	// Articles.create

	// Authors.create
	// Authors.create
	// Authors.create
	// Authors.create
	// Authors.create

	res.send("I just added some data for you")


})

app.listen(3000, () => {
  console.log('server is listening on PORT: 3000')
})

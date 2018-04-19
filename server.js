const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const session        = require('express-session');

// run our db file
require('./db/db');

app.use(session({
  secret: 'this would be some random string you would store',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));


// MIDDLEWARElk\\
app.use(express.static('public'))
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));


app.use((req, res, next) => {
  console.log('======================')
  console.log(req.path)
  console.log('======================')
  if(req.path.includes('authors') || req.path.includes('articles')){

      if(req.session.logged){
        next();
      } else {
        req.session.message = 'You need to be logged in to get your ice cream';
        res.redirect('/')
      }


  } else {
    next()
  }




});



// CONTROLLERS
const authorsController = require('./controllers/authors');
app.use('/authors', authorsController);
const articlesController = require('./controllers/articles')
app.use('/articles', articlesController);
const authController = require('./controllers/auth');
app.use('/', authController);

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

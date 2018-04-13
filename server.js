const express = require('express');
const app     = express();


const authorsController = require('./controllers/authors');




app.use('/authors', authorsController);




app.listen(3000, () => {
  console.log('server is listening on PORT: 3000')
})

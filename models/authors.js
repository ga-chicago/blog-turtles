const mongoose = require('mongoose');
const Article = require('./article.js')  // Article model

const authorSchema = new mongoose.Schema({
  name: String,
  articles: [Article.schema]
});

module.exports = mongoose.model('Author', authorSchema);

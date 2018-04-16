const mongoose = require('mongoose');


const articleSchema = new mongoose.Schema({
  title: {
  	type: String
  	// required: true
  	// unique: true
  }, 
  body: String
  // comments: [{
  // 	type: Date,
  // 	default: Date.now
  // }],
  // date: {
  // 	type: Date, 
  // 	default: Date.now
  // },
  // hidden: Boolean,
  // meta: {
  // 	votes: Number,
  // 	favs: Number
  // }
});

module.exports = mongoose.model('Article', articleSchema);

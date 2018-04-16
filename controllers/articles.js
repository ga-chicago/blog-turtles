const express = require('express');
const router = express.Router();
const Articles = require('../models/article.js')
const Author = require('../models/authors.js')

router.get('/', (req, res) => {
	Articles.find((err, theArticlesIFound) => {
		res.render('articles/index.ejs', {
			articles: theArticlesIFound
		})	
	})
})

// new article
// goal: make this get a list of authors
router.get('/new', (req, res) => {
	Author.find({}, (err, allAuthors) => {
		res.render('articles/new.ejs', {
			authors: allAuthors
		})
	})
})

// show
router.get('/:id', (req, res) => {
	Articles.findById(req.params.id, (err, thisArticle) => {
		Author.findOne({ 'articles._id': req.params.id }, (err, foundAuthor) => {
			if(err) console.log(err);
			console.log(foundAuthor)
			res.render('articles/show.ejs', {
				article: thisArticle,
				author: foundAuthor
			})			
		})
	})	
})

// edit
router.get('/:id/edit', (req, res)=>{
	Articles.findById(req.params.id, (err, foundArticle)=>{
		res.render('articles/edit.ejs', {
			article: foundArticle
		});
	});
});

//create
router.post('/', (req, res) => {
	// console.log(req.body); res.send(req.body);
	// first get the author
	Author.findById(req.body.authorId, (err, foundAuthor) => {
		Articles.create(req.body, (err, createdArticle) => {
			if(err) console.log(err);
			foundAuthor.articles.push(createdArticle);
			foundAuthor.save((err, data) => {			
				res.redirect('/articles')
			})
		})		
	})
})

// delete article --  modify it to also remote it from that author's articles list ([{}])
router.delete('/:id', (req, res)=>{
	Articles.findByIdAndRemove(req.params.id, (err, foundArticle)=>{
	// 	// delete the article
		Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {
			res.send(foundAuthor)
			foundAuthor.articles.id(req.params.id).remove() // ODM and ORM commonly use this type of chaining
			foundAuthor.save((err, data) => {
				res.redirect('/articles');
			})
		})
	});
});

// update -- this now also needs to update the author's articles list
router.put('/:id', (req, res)=>{
	// find this article in articles collection
	Articles.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedArticle)=>{
		// find the author with an article in their array that matches
		Author.findOne({ 'articles._id': req.params.id }, (err2, foundAuthor) => {
			// update article:
			// delete old one
			foundAuthor.articles.id(req.params.id).remove();
			// push new one
			foundAuthor.articles.push(updatedArticle)
			// save the updated author to database
			foundAuthor.save((err, data) => {
				// let's go back to that article's show page
				res.redirect('/articles/' + req.params.id)								
			})
		});
	});
});

module.exports = router;
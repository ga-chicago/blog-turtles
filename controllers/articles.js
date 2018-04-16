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
		res.render('articles/show.ejs', {
			article: thisArticle
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

router.delete('/:id', (req, res)=>{
	Articles.findByIdAndRemove(req.params.id, ()=>{
		res.redirect('/articles');
	});
});

// update
router.put('/:id', (req, res)=>{
	Articles.findByIdAndUpdate(req.params.id, req.body, ()=>{
		res.redirect('/articles');
	});
});

module.exports = router;
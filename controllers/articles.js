const express = require('express');
const router = express.Router();
const Articles = require('../models/article.js')

router.get('/', (req, res) => {
	Articles.find((err, theArticlesIFound) => {
		res.render('articles/index.ejs', {
			articles: theArticlesIFound
		})	
	})
})

router.get('/new', (req, res) => {
	res.render('articles/new.ejs')
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

// update
router.post('/', (req, res) => {
	Articles.create(req.body, (err, createdArticle) => {
		res.redirect('/articles')
	})
})

router.delete('/:id', (req, res)=>{
	Articles.findByIdAndRemove(req.params.id, ()=>{
		res.redirect('/articles');
	});
});

router.put('/:id', (req, res)=>{
	Articles.findByIdAndUpdate(req.params.id, req.body, ()=>{
		res.redirect('/articles');
	});
});

module.exports = router;
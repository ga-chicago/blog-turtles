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

router.get('/:id', (req, res) => {
	Articles.findById(req.params.id, (err, thisArticle) => {
		res.render('articles/show.ejs', {
			article: thisArticle
		})
	})	
})

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

module.exports = router;
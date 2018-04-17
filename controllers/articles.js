const express = require('express');
const router = express.Router();
const Articles = require('../models/article.js')
const Author = require('../models/authors.js')

router.get('/', async (req, res) => {

  try  {

    const theArticlesIFound = await Articles.find();

    res.render('articles/index.ejs', {
      articles: theArticlesIFound
    })

  } catch (err){

    res.send(err);

  }

});

// new article
// goal: make this get a list of authors
router.get('/new', async (req, res) => {

  try {
     const allAuthors = await Author.find();

      res.render('articles/new.ejs', {
          authors: allAuthors
        });

  } catch (err) {
    res.send(err)
  }

});

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

    Author.find({}, (err, allAuthors) => {
      // We can do this to find the author of the selected article
      Author.findOne({'articles._id': req.params.id}, (err, foundArticleAuthor) => {

        res.render('articles/edit.ejs', {
          article: foundArticle,
          authors: allAuthors,
          articleAuthor: foundArticleAuthor
        });
      });
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
router.put('/:id', async (req, res)=>{

  try {

    const findUpdatedArticle = Articles.findByIdAndUpdate(req.params.id, req.body, {new: true});

    const findFoundAuthor = Author.findOne({'articles._id': req.params.id });

    // For running pararrell async taks
    const [updatedArticle, foundAuthor ] = await Promise.all([findUpdatedArticle, findFoundAuthor])

    if(foundAuthor._id.toString() != req.body.authorId){
          foundAuthor.articles.id(req.params.id).remove();

          await foundAuthor.save();
          const newAuthor = await Author.findById(req.body.authorId);
          newAuthor.articles.push(updatedArticle);

          const savedNewAuthor = await newAuthor.save()
          res.redirect('/articles/' + req.params.id)


    } else {

          foundAuthor.articles.id(req.params.id).remove();
          // push new one
          foundAuthor.articles.push(updatedArticle)
          // save the updated author to database
          const savedFoundAuthor = await foundAuthor.save()
          res.redirect('/articles/' + req.params.id)

    }


  } catch (err){
    res.send(err);
  }













	// // find this article in articles collection
	// Articles.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedArticle)=>{
	// 	// find the author with an article in their array that matches
	// 	Author.findOne({ 'articles._id': req.params.id }, (err2, foundAuthor) => {
	// 		// update article:
 //      if(foundAuthor._id.toString() != req.body.authorId){
 //      // if the foundAuthor does not equal the req.body author
 //        foundAuthor.articles.id(req.params.id).remove();
 //        foundAuthor.save((err, savedFoundAuthor) => {
 //          Author.findById(req.body.authorId, (err, newAuthor) => {
 //            newAuthor.articles.push(updatedArticle);
 //            newAuthor.save((err, savedNewAuthor) => {
 //              res.redirect('/articles/' + req.params.id)
 //            })
 //        })
 //      })
 //      } else {

 //      }
	// 	});
	// });
});

module.exports = router;

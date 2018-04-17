const express = require('express');
const router = express.Router();
const Articles = require('../models/article.js')
const Author = require('../models/authors.js')

router.get('/', async (req, res, next) => {

  try  {
    console.log('hit')
    const theArticlesIFound = await Artices.find();

    res.render('articles/index.ejs', {
      articles: theArticlesIFound
    });

  } catch (err){

    next(err);

  }

});

// new article
// goal: make this get a list of authors
router.get('/new', async (req, res, next) => {

  try {
     const allAuthors = await Author.find();

      res.render('articles/new.ejs', {
          authors: allAuthors
        });

  } catch (err) {

      next(err);
  }

});

// show
router.get('/:id', async (req, res, next) => {
  try {
      const findArticle = Articles.findById(req.params.id);
      const findAuthor  = Author.findOne({'articles._id': req.params.id});

      // Promise All returns an array of the repsonse from DB queries,
      // Using array destructing to save the corresponding responses
      // as the variables thisArticle, and foundAuthor
      const [thisArticle, foundAuthor] = await Promise.all([findArticle, findAuthor]);

      res.render('articles/show.ejs', {
        article: thisArticle,
        author: foundAuthor
      });

  } catch (err) {

    next(err);
  }
});

// edit
router.get('/:id/edit', async (req, res, next)=>{

  try {

      const findArticle = Articles.findById(req.params.id);
      const findAllAuthors = Author.find();
      const findArticleAuthor = Author.findOne({'articles._id': req.params.id});

      const [foundArticle, allAuthors, foundArticleAuthor] = await Promise.all([findArticle, findAllAuthors, findArticleAuthor]);

      res.render('articles/edit.ejs', {
            article: foundArticle,
            authors: allAuthors,
            articleAuthor: foundArticleAuthor
          });

  } catch (err) {

      next(err);

  }



});

//create
router.post('/', async (req, res, next) => {
	// console.log(req.body); res.send(req.body);
  console.log(req.body, ' this is post')
  try {

      const findAuthor = Author.findById(req.body.authorId);
      const createArticle = Articles.create(req.body);

      const [foundAuthor, createdArticle] = await Promise.all([findAuthor, createArticle]);

      console.log(foundAuthor, createdArticle)
      foundAuthor.articles.push(createdArticle);

      await foundAuthor.save();
      res.redirect('/articles');

  } catch(err){
    console.log('errroor')
      next(err);
  }



})

// delete article --  modify it to also remote it from that author's articles list ([{}])
router.delete('/:id', async (req, res, next)=>{
  console.log(req.params.id, ' this is delete params')
  try {

      const deleteArticle = Articles.findByIdAndRemove(req.params.id);
      const findAuthor    = Author.findOne({'articles._id': req.params.id});

      const [deletedArticle, foundAuthor] = await Promise.all([deleteArticle, findAuthor]);
      console.log(foundAuthor, 'foundAuthor')
      foundAuthor.articles.id(req.params.id).remove()
      await foundAuthor.save();
      res.redirect('/articles');

  } catch(err){
    console.log(err)
    next(err);
    // throw new Error(400);
  }

});

// update -- this now also needs to update the author's articles list
router.put('/:id', async (req, res, next)=>{

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
          await foundAuthor.save()
          res.redirect('/articles/' + req.params.id)

    }


  } catch (err){
    next(err)
  }

});

module.exports = router;

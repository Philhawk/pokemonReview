'use strict';


var expect = require('chai').expect;
var request = require('supertest');
var app = require('../app');
var Article = require('../models/article');
var agent = request.agent(app);
var db = require('../models/database');

/**
 *
 * Article Route Tests
 *
 * Do these after you finish the Article Model tests
 *
 */
describe('Articles Route:', function () {

  /**
   * First we clear the database before beginning each run
   */
  before(function () {
    return db.sync({force: true});
  });

  describe('GET /articles', function () {
    /**
     * Problem 1
     * We'll run a GET request to /articles
     *
     * 1.  It should return JSON (i.e., use res.json)
     * 2.  Because there isn't anything in the DB, it should be an empty array
     *
     * **Extra Credit**: Consider using app.param to automatically load
     * in the Article whenever a param :id is detected
     */
    xit('responds with an array via JSON', function () {

      return agent
      .get('/articles')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function (res) {
        // res.body is the JSON return object
        expect(res.body).to.be.an.instanceOf(Array);
        expect(res.body).to.have.length(0);
      });

    });

    /**
     * Problem 2
     * Save an article in the database using our model and then retrieve it
     * using the GET /articles route
     *
     */
    xit('returns an article if there is one in the DB', function () {

      var article = Article.build({
        title: 'Test Article',
        content: 'Test body'
      });

      return article.save().then(function () {

        return agent
        .get('/articles')
        .expect(200)
        .expect(function (res) {
          expect(res.body).to.be.an.instanceOf(Array);
          expect(res.body[0].content).to.equal('Test body');
        });

      });

    });

    /**
     * Problem 3
     * Save a second article in the database using our model, then retrieve it
     * using the GET /articles route
     *
     */
    xit('returns another article if there is one in the DB', function () {

      var article = Article.build({
        title: 'Another Test Article',
        content: 'Another test body'
      });

      return article.save().then(function () {

        return agent
        .get('/articles')
        .expect(200)
        .expect(function (res) {
          expect(res.body).to.be.an.instanceOf(Array);
          expect(res.body[0].content).to.equal('Test body');
          expect(res.body[1].content).to.equal('Another test body');
        });

      });

    });

  });

  /**
   * Search for articles by ID
   */
  describe('GET /articles/:id', function () {

    var article;

    // create another article for test
    before(function () {

      article = Article.build({
        title: 'Second Article',
        content: 'This article is good'
      });

      return article.save();

    });

    /**
     * This is a proper GET /articles/ID request
     * where we search by the ID of the article created above
     */
    xit('returns the JSON of the article based on the id', function () {

      return agent
      .get('/articles/' + article.id)
      .expect(200)
      .expect(function (res) {
        if (typeof res.body === 'string') {
          res.body = JSON.parse(res.body);
        }
        expect(res.body.title).to.equal('Second Article');
      });

    });

    /**
     * Here we pass in a bad ID to the URL, we should get a 404 error
     */
    xit('returns a 404 error if the ID is not correct', function () {

      return agent
      .get('/articles/74')
      .expect(404);

    });

  });

  /**
   * Series of tests to test creation of new Articles using a POST
   * request to /articles
   */
  describe('POST /articles', function () {

    /**
     * Test the creation of an article
     * Here we don't get back just the article, we get back a Object
     * of this type:
     *
     * {
     *   message: 'Created successfully'
     *   article: {
     *     id: ...
     *     title: ...
     *     content: ...
     *   }
     * }
     */
    xit('creates a new article', function () {

      return agent
      .post('/articles')
      .send({
        title: 'Awesome POST-Created Article',
        content: 'Can you believe I did this in a test?'
      })
      .expect(200)
      .expect(function (res) {
        expect(res.body.message).to.equal('Created successfully');
        expect(res.body.article.id).to.not.be.an('undefined');
        expect(res.body.article.title).to.equal('Awesome POST-Created Article');
      });

    });

    // This one should fail with a 500 because we don't set the article.body
    xit('does not create a new article without a body', function () {

      return agent
      .post('/articles')
      .send({
        title: 'This Article Should Not Be Allowed'
      })
      .expect(500);

    });

    // Check if the articles were actually saved to the database
    xit('saves the article to the DB', function () {

      return Article.findOne({
        where: {
          title: 'Awesome POST-Created Article'
        }
      })
      .then(function (article) {
        expect(article).to.exist; // eslint-disable-line no-unused-expressions
        expect(article.content).to.equal('Can you believe I did this in a test?');
      });

    });

  });

  /**
   * Series of tests to test updating of Articles using a PUT
   * request to /articles/:id
   */
  describe('PUT /articles/:id', function () {

    var article;

    before(function () {

      return Article.findOne({
        where: {
          title: 'Awesome POST-Created Article'
        }
      })
      .then(function (_article) {
        article = _article;
      })
      .catch(function(err) { console.error(err.message); });

    });

    /**
     * Test the updating of an article
     * Here we don't get back just the article, we get back a Object
     * of this type:
     *
     * {
     *   message: 'Updated successfully'
     *   article: {
     *     id: ...
     *     title: ...
     *     content: ...
     *   }
     * }
     */
    xit('updates an article', function () {

      return agent
      .put('/articles/' + article.id)
      .send({
        title: 'Awesome PUT-Updated Article'
      })
      .expect(200)
      .expect(function (res) {
        expect(res.body.message).to.equal('Updated successfully');
        expect(res.body.article.id).to.not.be.an('undefined');
        expect(res.body.article.title).to.equal('Awesome PUT-Updated Article');
        expect(res.body.article.content).to.equal('Can you believe I did this in a test?');
      });

    });

    xit('saves updates to the DB', function () {

      return Article.findById(article.id).then(function (foundArticle) {
        expect(foundArticle).to.exist; // eslint-disable-line no-unused-expressions
        expect(foundArticle.title).to.equal('Awesome PUT-Updated Article');
      });

    });

    xit('gets 500 for invalid update', function () {

      return agent
      .put('/articles/' + article.id)
      .send({ title: '' })
      .expect(500);

    });

  });

});

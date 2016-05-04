'use strict';

var expect = require('chai').expect;
var Article = require('../models/article');
var User = require('../models/user');
var db = require('../models/database');

/**
 *
 * Start here!
 *
 * These tests describe the model that you'll be writing in models/article.js
 *
 */

describe('Articles', function () {

  /**
   * First we clear the database and recreate the tables before beginning each run
   */
  before(function () {
    return db.sequelize.sync({force: true});
  });

  var fullText = 'The South African cliff swallow (Petrochelidon spilodera), also known as the South African swallow, is a species of bird in the Hirundinidae family.';

  /**
   * Your model should have two fields (both required): `title` and `content`.
   *
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#validations
   */
  it('has title and content fields of type String', function () {
    return Article.create({
      title: 'Migratory Birds',
      content: fullText
    }).then(function (savedArticle) {
      expect(savedArticle.title).to.equal('Migratory Birds');
      expect(savedArticle.content).to.equal(fullText);
    });

  });

  xit('requires content', function () {

    var article = Article.build({
      title: 'My Second Article'
    });

    return article.validate()
      .then(function(result) {
        expect(result).to.be.an('object');
        expect(result.message).to.equal('notNull Violation: content cannot be null');
      });
    

  });

  xit('requires title', function () {

    var article = Article.build({
      content: 'Some more wonderful text',
    });

    return article.validate()
      .then(function (result) {
        expect(result).to.be.an('object');
        expect(result.message).to.equal('notNull Violation: title cannot be null');
      });

  });

  xit('can handle long content', function() {
    var articleContent = 'WALL-E (stylized with an interpunct as WALL·E) is a 2008 American computer-animated science-fiction comedy film produced by Pixar Animation Studios and released by Walt Disney Pictures. Directed by Andrew Stanton, the story follows a robot named WALL-E, who is designed to clean up an abandoned, waste-covered Earth far in the future. He falls in love with another robot named EVE, who also has a programmed task, and follows her into outer space on an adventure that changes the destiny of both his kind and humanity. Both robots exhibit an appearance of free will and emotions similar to humans, which develop further as the film progresses.';
    return Article.create({
      title: 'WALL-E',
      content: articleContent
    }).then(function(result) {
      expect(result).to.be.an('object');
      expect(result.title).to.equal('WALL-E');
      expect(result.content).to.equal(articleContent);
    });
  });

  /**
   * Your model should have a timestamp called `lastUpdatedAt`
   *
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#configuration
   */

  xit('has updatedAt field that is originally the time at creation', function (done) {

    var timestampJustBeforeCreation = Date.now();

    Article.create({
      title: 'Ada Lovelace',
      content: 'World\'s first computer programmer, predated any *actual* computer.'
    }).then(function (createdArticle) {
      var updatedAt = createdArticle.lastUpdatedAt;

      expect(updatedAt).to.exist;
      expect(updatedAt).to.be.an.instanceOf(Date);

      expect(Number(updatedAt)).to.be.closeTo(timestampJustBeforeCreation, 5);

      setTimeout(function () {
        // should still be the same as before, seeing as we have not resaved
        expect(createdArticle.lastUpdatedAt).to.equal(updatedAt);
        done();
      }, 50);

    }).catch(done);

  });

  /**
   * Set up a virtual field (check out sequelize getter methods) called `snippet`
   * that returns the first 23 characters of the content followed by "...".
   *
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#defining-as-part-of-the-model-options
   */
  xit('has a virtual 23-character snippet field appended with "..."', function () {

    return Article.findOne({ where: { title: 'Migratory Birds' } }).then(function (article) {
      expect(article.content).to.equal(fullText);
      expect(article.snippet).to.equal('The South African cliff...');
    });

  });

  /**
   * Set up an instance method (check out mongoose instanceMethods) called `truncate`
   * that will shorten the article instance content to a passed-in length.
   * This method does not save to the backend, it just modifies the mongoose
   * object so the user can choose if and when to actually save.
   *
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#expansion-of-models
   */
  xit('has an instance method to truncate the content', function () {

    return Article.findOne({ where: { title: 'Migratory Birds' } }).then(function (article) {
      expect(article.content).to.equal(fullText);
      article.truncate(12);
      expect(article.content).to.equal('The South Af');
    });

  });

  xit('content truncation accepts any length', function () {

    return Article.findOne({ where: { title: 'Migratory Birds' } }).then(function (article) {
      var randLength = Math.ceil(Math.random() * 20);
      expect(article.content).to.equal(fullText);
      article.truncate(randLength);
      expect(article.content).to.have.length(randLength);
    });

  });

  xit('does not save the content once truncated', function() {
    return Article.findOne({ where: { title: 'Migratory Birds' } }).then(function(article) {
      expect(article.content).to.equal(fullText);
      article.truncate(7);
      expect(article.content).to.have.length(7);
      return Article.findOne({ where: { title: 'Migratory Birds' } })
    })
    .then(function(article) {
      expect(article.content).to.equal(fullText);
    });
  });

  /**
   * Set up a class method called findByTitle that's a convenience
   * method to find a *single* document by its title.
   *
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#expansion-of-models
   */

  xit('static method findByTitle finds one article by its title', function () {

    return Article.findByTitle('Migratory Birds')
      .then(function (article) {
        expect(article).not.to.be.an.instanceOf(Array);
        expect(article.content).to.equal(fullText);
      });

  });

  xit('recalculates lastUpdatedAt timestamp every time it is saved', function () {

    var prevArticleUpdatedAt, timestampJustBeforeSave;
    return Article.findOne({ where: { title: 'Migratory Birds' } }).then(function (article) {

      prevArticleUpdatedAt = article.lastUpdatedAt;
      timestampJustBeforeSave = Date.now();

      article.content = 'The barn swallow is a bird of open country that normally uses man-made structures to breed and consequently has spread with human expansion.';

      return article.save();
    }).then(function (updatedArticle) {
      expect(updatedArticle.lastUpdatedAt).to.be.above(prevArticleUpdatedAt);
      expect(Number(updatedArticle.lastUpdatedAt)).to.be.closeTo(timestampJustBeforeSave, 5);
    });

  });

  /**
   * Add a `belongsTo` relationship between articles and users,
   * but make sure the user is called `author` for each article.
   *
   * http://docs.sequelizejs.com/en/latest/docs/associations/#belongsto
   */

  xit('belongs to a user, who is stored as the article\'s `author`', function() {
    var user;
    return User.create({ name: 'Alatar the Blue'})
      .then(function(u) {
        user = u;
        return Article.create({
          title: 'Blue Wizards',
          content: 'They are two of the five Wizards (or Istari) sent by the Valar to Middle-earth to aid in the struggle against Sauron.'
        });
      })
      .then(function(article) {
        return article.setAuthor(user);
      })
      .then(function() {
        return Article.findOne({ 
          where: { title: 'Blue Wizards' },
          include: { model: User, as: 'author' }
        });
      })
      .then(function(article){
        expect(article.author).to.exist;
        expect(article.author.name).to.equal('Alatar the Blue');
      });
  });


  /** EXTRA CREDIT
   * Your Article model should have a tag field that's an array, but when we
   * access it, we should get one string: the tags joined by a comma and space
   *
   * Look at getters and setters:
   * http://docs.sequelizejs.com/en/latest/docs/models-definition/#getters-setters
   *
   * To activate this spec, change `xit` to `it`
   */
  xit('has a tags field with a custom getter', function () {
    return Article.create({
      title: 'Taggy',
      content: 'So Taggy',
      tags: ['tag1', 'tag2', 'tag3']
    })
    .then(function (article) {
      expect(article.tags).to.equal('tag1, tag2, tag3');
    });
  });

});

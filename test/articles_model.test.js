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
    return db.sync({force: true});
  });

  var fullText = 'The South African cliff swallow (Petrochelidon spilodera), also known as the South African swallow, is a species of bird in the Hirundinidae family.';

  /**
   * Your model should have two fields (both required): `title` and `content`.
   *
   * http://docs.sequelizejs.com/en/stable/docs/models-definition/#validations
   */
  it('has title and content fields', function () {

    return Article.create({
      title: 'Migratory Birds',
      content: fullText
    })
    .then(function (savedArticle) {
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
      expect(result).to.be.an.instanceOf(Error);
      expect(result.message).to.contain('content cannot be null');
    });

  });

  xit('requires title (in a more strict way than for content)', function () {

    var article = Article.build({
      title: '',
      content: 'Some more wonderful text'
    });

    return article.validate()
    .then(function (result) {
      expect(result).to.be.an.instanceOf(Error);
      expect(result.message).to.contain('Validation error');
    });

  });

  xit('can handle long content', function() {

    var articleContent = 'WALL-E (stylized with an interpunct as WALL·E) is a 2008 American computer-animated science-fiction comedy film produced by Pixar Animation Studios and released by Walt Disney Pictures. Directed by Andrew Stanton, the story follows a robot named WALL-E, who is designed to clean up an abandoned, waste-covered Earth far in the future. He falls in love with another robot named EVE, who also has a programmed task, and follows her into outer space on an adventure that changes the destiny of both his kind and humanity. Both robots exhibit an appearance of free will and emotions similar to humans, which develop further as the film progresses.';

    return Article.create({
      title: 'WALL-E',
      content: articleContent
    })
    .then(function(result) {
      expect(result).to.be.an('object');
      expect(result.title).to.equal('WALL-E');
      expect(result.content).to.equal(articleContent);
    });

  });


  /**
   * Set up a virtual field (check out sequelize getter methods) called `snippet`
   * that returns the first 23 characters of the content followed by "...".
   *
   * http://docs.sequelizejs.com/en/stable/docs/models-definition/#defining-as-part-of-the-model-options
   */
  xit('has a virtual 23-character snippet field appended with "..."', function () {

    return Article.findOne({ where: { title: 'Migratory Birds' } })
    .then(function (article) {
      expect(article.content).to.equal(fullText);
      expect(article.snippet).to.equal('The South African cliff...');
    });

  });

  /**
   * Set up an instance method (check out sequelize instanceMethods) called `truncate`
   * that will shorten the article instance content to a passed-in length.
   * This method does not save to the backend, it just modifies the mongoose
   * object so the user can choose if and when to actually save.
   *
   * http://docs.sequelizejs.com/en/stable/docs/models-definition/#expansion-of-models
   */
  xit('has an instance method to truncate the content', function () {

    return Article.findOne({ where: { title: 'Migratory Birds' } })
    .then(function (article) {
      expect(article.content).to.equal(fullText);
      article.truncate(12);
      expect(article.content).to.equal('The South Af');
    });

  });

  xit('content truncation accepts any length', function () {

    return Article.findOne({ where: { title: 'Migratory Birds' } })
    .then(function (article) {
      var randLength = Math.ceil(Math.random() * 20);
      expect(article.content).to.equal(fullText);
      article.truncate(randLength);
      expect(article.content).to.have.length(randLength);
    });

  });

  xit('does not save the content once truncated', function() {

    return Article.findOne({ where: { title: 'Migratory Birds' } })
    .then(function(article) {
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
   * http://docs.sequelizejs.com/en/stable/docs/models-definition/#expansion-of-models
   */

  xit('class method findByTitle finds one article by its title', function () {

    return Article.findByTitle('Migratory Birds')
    .then(function (article) {
      expect(article).not.to.be.an.instanceOf(Array);
      expect(article.content).to.equal(fullText);
    });

  });

  /**
   * Add a `belongsTo` relationship between articles and users,
   * but make sure the user is called `author` for each article.
   *
   * http://docs.sequelizejs.com/en/stable/docs/associations/#belongsto
   */

  xit('belongs to a user, who is stored as the article\'s `author`', function() {

    var user;
    return User.create({ name: 'Alatar the Blue'})
    .then(function(createdUser) {
      user = createdUser;
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
      expect(article.author).to.exist; // eslint-disable-line no-unused-expressions
      expect(article.author.name).to.equal('Alatar the Blue');
    });

  });

  /**
   * Your model should have a field called `version`,
   * which increases by 1 every time you save
   *
   * http://docs.sequelizejs.com/en/stable/docs/hooks/
   */

  describe('has a version field', function() {

    before(function() {
      return Article.create({
        title: 'Biological Immortality',
        content: 'Biological immortality refers to a stable or decreasing rate of mortality from senescence, thus decoupling it from chronological age.'
      });
    });

    xit('that is originally 0', function() {

      return Article.findOne({where: {title: 'Biological Immortality'}})
      .then(function(article) {
        expect(article.version).to.equal(0);
      });

    });

    xit('that increments by 1 every time you update the document', function() {

      return Article.findOne({where: {title: 'Biological Immortality'}})
      .then(function(article) {
        article.content = 'Biological immortality is a lie!';
        return article.save();
      })
      .then(function(article) {
        expect(article.version).to.equal(1);
      });

    });

  });

  /** EXTRA CREDIT
   * Your Article model should have a tag field that's an array, but when we
   * access it, we should get one string: the tags joined by a comma and space
   *
   * Look at getters and setters:
   * http://docs.sequelizejs.com/en/stable/docs/models-definition/#getters-setters
   *
   * To activate this spec, change `xit` to `it`
   */
  xit('has a `tags` field with a custom getter', function () {

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

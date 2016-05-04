'use strict';

var db = require('./database');
var Sequelize = db.Sequelize;
var sequelize = db.sequelize;

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

var Article = sequelize.define('Article', {


});

//---------^^^---------  your code above  ---------^^^----------

module.exports = Article;

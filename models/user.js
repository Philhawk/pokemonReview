'use strict';

var db = require('./database');
var Sequelize = db.Sequelize;
var sequelize = db.sequelize;

var User = sequelize.define('User', {
  name: Sequelize.STRING
});

module.exports = User;


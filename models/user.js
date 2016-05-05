'use strict';

var db = require('./database');
var Sequelize = require('sequelize');

var User = db.define('User', {
  name: Sequelize.STRING
});

module.exports = User;


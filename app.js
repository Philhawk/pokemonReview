var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var chalk = require('chalk');

var routes = require('./routes');

var app = express();

app.use(morgan('      :method :url :status'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/', routes);

// custom error handling to remove stack trace
app.use(function (err, req, res, next) {
    console.log(chalk.magenta('      ' + err.message));
    res.status(err.status || 500).end();
});

module.exports = app;

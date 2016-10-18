var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var Models = require('./models');
var db = Models.db
var routes = require('./routes');
var app = express();


app.use(morgan('      :method :url :status'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/', routes);

db.sync();

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// handle all errors (anything passed into `next()`)
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.error(err);
  res.render(
    // ... fill in this part
  );
});

module.exports = app;

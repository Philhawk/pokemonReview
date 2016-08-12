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

// custom error handling
app.use(function (err, req, res, next) {
  // clean up the trace to just relevant info
  var cleanTrace = err.stack
  .split('\n')
  .filter(line => {
    var notNodeInternal = line.indexOf(__dirname) > -1;
    var notNodeModule = line.indexOf('node_modules') === -1;
    return notNodeInternal && notNodeModule;
  })
  .join('\n');
  // colorize and format the output
  console.log(chalk.magenta('      ' + err.message));
  console.log('    ' + chalk.gray(cleanTrace));
  // send back error status
  res.status(err.status || 500).end();
});

module.exports = app;

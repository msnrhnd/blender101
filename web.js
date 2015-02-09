var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 8080);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  var chap = '';
  if (req.query.chap) {
    chap = req.query.chap;
  }
  res.render('index', {chap: chap});
});

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
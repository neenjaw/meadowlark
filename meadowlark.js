var express = require('express');

var app = express();

// set up handlebars view engine

var handlebars = require('express-handlebars')
      .create({
        defaultLayout:'main',
        layoutsDir:'src/views/layouts/',
        partialsDir:'src/views/partials/',
      });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', 'src/views/');

var fortune = require('./src/lib/fortune.js');

app.use(express.static(__dirname + '/public'));

// set port

app.set('port', process.env.PORT || 3000);

// testing flag from url query

app.use(function(req, res, next){
  res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
  next();
});

// routes

app.get('/', function(req, res){
  res.render('home');
});

app.get('/about', function(req, res){
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
  });
});

app.get('/about/contact', function(req, res){
  res.type('text/plain');
  res.send('Contact Meadowlark Travel');
});

app.get('/about/directions', function(req, res){
  res.type('text/plain');
  res.send('Directions to Meadowlark Travel');
});

app.get('/tours/hood-river', function(req, res){
  res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
  res.render('tours/request-group-rate');
});

// custom 404 page
app.use(function(req, res){
  res.status(404);
  res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http:localhost:' +
    app.get('port') + '; press ctrl-c to terminate.' );
});

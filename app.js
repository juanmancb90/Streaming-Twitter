var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var twitter = require('ntwitter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/*configuracion de parametros de twitter stream ntwitter*/
 
//configuración de los datos de nuestra app de twitter

var server = require('http').Server(app);
var io = require('socket.io')(server);

var credentialsTwitter = new twitter({
  consumer_key: 'consumer_key',
  consumer_secret: 'consumer_secret',
  access_token_key: 'access_token_key',
  access_token_secret:'access_token_secret'
});

 
//más info de status/filter en 
//https://dev.twitter.com/docs/streaming-apis/parameters
io.sockets.on('connection', function(socket) 
{
  credentialsTwitter.stream('statuses/filter', 
      {
          'track':'playstation4',//filtramos por la palabra playstation
          'filter_level':'medium',//el nivel del filtro
          'language':'es,en'//filtramos solo en español y en inglés
    },
    function(stream) 
    {
        stream.on('data',function(data)
        {
              socket.emit('twitter',data);
              console.log(data);
        });
    });
    console.log('a user connected');
});

module.exports = app;

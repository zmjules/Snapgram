
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var login = require('./routes/login');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.cookieSession({'key': 'sid', 'secret': 'someSecret'}));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// KODY ADDS A COMMENT HERE!!
// JULIA ADDS TO THE COMMENT.

var requireAuthentication = function(req, res, next) {
    if (req.session.username)
    {
        next();
    }
    else
    {
        res.redirect('/login');
    }
}

var loadUser = function(req, res, next) {
    console.log("Test2");
    next();
}

app.get('/login', login.loginPage);
app.post('/login', login.loginAction);

app.all('*', requireAuthentication);
app.get('/', routes.index);

// initialize server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

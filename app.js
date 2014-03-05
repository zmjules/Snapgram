
/**
 * Module dependencies.
 */

var express = require('express');
var orm = require('orm');
var routes = require('./routes');
var login = require('./routes/login');
var http = require('http');
var path = require('path');

var app = express();

app.use(orm.express("mysql://s513_b.rougeau:10013253@localhost/s513_b.rougeau", {
  define: function (db, models, next) {
    models.User = db.define("User", { 
        FirstName: String,
        LastName : String,
        Username : String,
        Password : String
    });
    models.Photo = db.define("Photo", { 
        Path: String,
        Timestamp : Date
    });
    models.Follow = db.define("Follow", {
        //No fields, both fields are relationships defined below
    });
    models.Feed = db.define("Feed", { 
        FeedList: String
    }, {
        methods: {
            addToFeed: function (photoID) {
                this.Feed = JSON.stringify(JSON.parse(this.Feed) + photoID);
                this.save();
            },
            getFeed: function () {
                return JSON.parse(this.Feed);
            }
    }
    });
    models.Photo.hasOne("owner", models.User);
    models.Follow.hasOne("follower", models.User);
    models.Follow.hasOne("followee", models.User);
    models.Feed.hasOne("user", models.User);
    next();
  }
}));

                  
                  
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

var requireAuthentication = function(req, res, next) {
    if (req.session.user)
    {
        next();
    }
    else
    {
        res.redirect('/sessions/new');
    }
}

app.get('/sessions/new', login.loginPage);
app.post('/sessions/create', login.loginAction);
app.get('/users/new', login.registerPage);
app.post('/users/create', login.registerAction);


//All pages past this point require authentication
app.all('*', requireAuthentication);

app.get('/sessions/end', login.logoutAction);
app.get('/feed', routes.index);
app.get('/users/:id', routes.stream);
app.get('/users/:id/follow', routes.follow);
app.get('/users/:id/unfollow', routes.unfollow);
app.get('/photos/new', login.uploadPage);
app.post('/photos/create', login.uploadAction);
app.get('/', function(req, res) { res.redirect('/feed'); });

// initialize server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

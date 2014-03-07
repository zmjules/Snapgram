
/**
 * Module dependencies.
 */

var express = require('express');
var orm = require('orm');
var routes = require('./routes');
var login = require('./routes/login');
var bulk = require('./routes/bulk');
var photos = require('./routes/photos');
var http = require('http');
var path = require('path');

var app = express();
app.use(express.bodyParser({keepExtensions: true, uploadDir: './test'}));

app.use(orm.express("mysql://s513_b.rougeau:10013253@localhost/s513_b.rougeau", {
  define: function (db, models, next) {
    models.User = db.define("User", { 
        FirstName: String,
        LastName : String,
        Username : String,
        Password : String
    }, {
      hooks: {
        afterCreate: function (next){
          models.Follow.create([
            {
              follower_id: this.id,
              followee_id: this.id
            }], function (err, items) {
              if (err) 
                {
                error = err.message;
                console.log(error);
                //TODO: Redirect to 404 page
                }
                else
                {                        
                console.log(items[0]);
                }
            })
        }
      }
    })

    models.Photo = db.define("Photo", { 
        Path: String,
        Timestamp : Date
    }, {
      hooks: {
        afterCreate: function (next){
		  var photo_id = this.id;
          models.Follow.find({followee_id: this.owner_id}, function(err, rows) {
            rows.forEach(function(row){
              // add photos to all follower's feeds
              row.getFollower(function (err, follower){
                follower.getFeed(function (err, feed){
				  if (feed.length == 0)
				  {
					models.Feed.create([
					{
						user_id: follower.id,
						FeedList: '[]'
					}], function (err, newFeed) {
						if (err) 
						{
							error = err.message;
							console.log(error);
							//TODO: Redirect to 500 page
						}
						else
						{                        
							newFeed[0].addToFeed(photo_id);
						}
					})
				  }
				  else
				  {
					feed[0].addToFeed(photo_id);
				  }
                })
				})
            })
        });
      }
    }
  });

    models.Follow = db.define("Follow", {
        //No fields, both fields are relationships defined below
    });
    models.Feed = db.define("Feed", { 
        FeedList: String
    }, {
        methods: {
            addToFeed: function (photoID) {
				currentList = JSON.parse(this.FeedList)
				currentList.push(photoID);
                this.FeedList = JSON.stringify(currentList);
                this.save();
            },
            getFeed: function () {
                return JSON.parse(this.FeedList);
            }
    }
    });
    models.Photo.hasOne("owner", models.User);
    models.Follow.hasOne("follower", models.User);
    models.Follow.hasOne("followee", models.User);
    models.Feed.hasOne("user", models.User, {
      reverse: "feed"
    });
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

//from http://www.hacksparrow.com/express-js-custom-error-pages-404-and-500.html
// Handle 404
  app.use(function(req, res) {
     res.status(404).render('404.jade', {title: '404: File Not Found'});
  });
  
  // Handle 500
  app.use(function(error, req, res, next) {
     res.status(500).render('500.jade', {title: '500: Internal Server Error'});
  });

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

app.get('/bulk/clear', bulk.clear);
app.post('/bulk/users', bulk.users);
app.post('/bulk/photos', bulk.photos);

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
app.get('/photos/new', photos.uploadPage);
app.post('/photos/create', photos.uploadAction);
app.get('/photos/:id.:ext', photos.load);
app.get('/photos/thumbnail/:id.:ext', photos.loadThumbnail);
app.get('/', function(req, res) { res.redirect('/feed'); });

// initialize server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

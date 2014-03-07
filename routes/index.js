
/*
 * GET home page.
 */
 
var sortPhotos = function(a, b) {
	return ( (a.Timestamp > b.Timestamp) ? -1 : 1);
}

exports.index = function(req, res){
  req.models.Feed.find({user_id: req.session.user.id}, function (err, rows) {
      var feed = rows[0].getFeed()
	  var photos = []
	  var count = 0;	//Use count to call render after all photos have been added (since it's asynchronous)
	  if (feed.length == 0)
	  {
		res.render('index', { authenticated: true, title: 'Feed', user: req.session.user, feed: photos, req: req});
	  }
	  feed.forEach(function(entry) {
		req.models.Photo.get(entry, function(err, photo)
		{
			photo.extension = photo.Path.split(".")[1];
			photo.getOwner(function(err, user) {
				count++;
				photo.owner_name = user.FirstName;
				photos.push(photo);
				if (count == feed.length)
				{
					photos.sort(sortPhotos);
					res.render('index', { authenticated: true, title: 'Feed', user: req.session.user, feed: photos, req: req});
				}
			});
			
		});
	  });
        
        });
};

// TODO: Create stream.jade
// Create array of images.
exports.stream = function(req, res){
	// create photo array here
	var id = req.params.id;
	var user;
    var following = false;

	req.models.User.find({ID: id}, function(err, rows) {
       if (err || rows.length != 1)
       {
           if (rows.length == 0)
              error = "User does not exist";
           else if (rows.length > 1)
              error = "Multiple users found with this username (corrupted database)";
           else
              error = err.message;
           console.log("Error: " + error);
           //Need to redirect to 404 here
       }
       else
       {
            user = rows[0]

            req.models.Follow.find({follower_id: req.session.user.id, followee_id: id}, function(err, rows) {
                if (err)
                {
                    error = err.message;
                    console.log("Error: " + error);
                    //TODO: Redirect to 500 page
                }
                else if (rows.length == 0)
                {
                   following = false;
                }
                else
                {
                    following = true;
                }
				
				var photos = [];
				var count = 0;
				
				req.models.Photo.find({owner_id: id}, function (err, rows) {
					if (rows.length == 0)
					{
						res.render('stream', { authenticated: true, authenticatedUser: req.session.user, title: 'Stream', id: id, user: user, following: following, photos: photos});
					}
					rows.forEach( function(photo) {
						photo.extension = photo.Path.split(".")[1];
						photo.getOwner(function(err, user) {
							count++;
							photo.owner_name = user.FirstName;
							photos.push(photo);
							if (count == rows.length)
							{
								photos.sort(sortPhotos);
								res.render('stream', { authenticated: true, authenticatedUserID: req.session.user.id, title: 'Stream', id: id, user: user, following: following, photos: photos});
							}
						});
					});
				});
                                   
           });
         }
     });
};

exports.follow = function(req, res){
	// create photo array here
	var followerID = parseInt(req.session.user.id);
    var followeeID = req.params.id;
    
    if (followerID == followeeID)
    {
        console.log("You can't follow yourself stupid");
        //TODO: Redirect to 404 page
        res.redirect('/feed');
        return;
    }
	
    //Check that the requested user to follow exists
    req.models.User.find({ID: followeeID}, function(err, rows) {
     if (err || rows.length != 1)
     {
     if (rows.length == 0)
       error = "User does not exist";
     else if (rows.length > 1)
       error = "Multiple users found with this username (corrupted database)";
     else
       error = err.message;
     //TODO: Redirect to 404 page
     console.log("Error: " + error);
     res.redirect('/feed');
     }
     else
     {
        req.models.Follow.find({follower_id: followerID, followee_id: followeeID}, function(err, rows) {
               if (err || rows.length != 0)
               {
                if (err)
                   error = err.message;
                else
                   error = "Follow relationship already exists";
                //TODO: Redirect to 404 page
                console.log("Error: " + error);
                res.redirect('/feed');
                res.end();
               }
               else
               {
                   req.models.Follow.create([
                   {
                       follower_id: followerID,
                       followee_id: followeeID
                   }
                   ], function (err, items) {
                            if (err) 
                            {
                            error = err.message;
                            console.log(error);
                            //TODO: Redirect to 404 page
                            res.redirect('/feed');
                            res.end();
                            }
                            else
                            {                        
                            console.log(items[0]);
                            res.redirect('/users/' + followeeID);
                            res.end();
                            }
                    })
               }
         });
        }
    });
};

exports.unfollow = function(req, res){
// create photo array here
var followerID = parseInt(req.session.user.id);
var followeeID = req.params.id;

if (followerID == followeeID)
{
    console.log("You can't unfollow yourself stupid");
    //TODO: Redirect to 404 page
    res.redirect('/feed');
    return;
}

//Check that the follow relationship exists
req.models.Follow.find({follower_id: followerID, followee_id: followeeID}, function(err, rows) {
        if (err || rows.length == 0)
        {
            if (err)
                error = err.message;
            else
                error = "Follow relationship doesn't exist";
            //TODO: Redirect to 404 page
            console.log("Error: " + error);
            res.redirect('/feed');
        }
        else
        {
            rows[0].remove(function (err) {
                if (err)
                {
                    error = err.message;
                    //TODO: Redirect to 404 page
                    console.log("Error: " + error);
                    res.redirect('/feed');
                }
                res.redirect('/users/' + followeeID);
             });
        }
     });
};

/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Feed', user: req.session.user });
};

// TODO: Create stream.jade
// Create array of images.
exports.stream = function(req, res){
	// create photo array here
	var id = req.params.id;
	var user;

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
           req.session.user = rows[0];
           user = req.session.user;
       }
    });

	console.log('ID: ' + req.params.id);

	res.render('stream', { title: 'Stream', id: id, user: req.session.user});
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
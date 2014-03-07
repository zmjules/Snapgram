
/*
 * GET home page.
 */


var time_between_in_words = function(from_date, to_date){
    var result = (to_date - from_date);
    if (result < 0)
    {
	return ('Invalid parameters: to_date should be later than from_date')
    }
    if (result < 1000)
    {
    	return 'a moment';
    }
    else
    {
       var years = (to_date.getFullYear()) - (from_date.getFullYear());
       var months = (to_date.getMonth()) - (from_date.getMonth());
       if (years > 0)
       {
        if (months < 0)
        {
           years--;
           months += 12;
        }
        if (years > 0)
        {
           return (years + (years!=1?' years':' year'));
        }
       }
       if (months > 0)
       {
        var days = (to_date.getDate()) - (from_date.getDate());
        if (days < 0)
        {
           months--;
        }
        if (months > 0)
        {
           return (months + (months!=1?' months':' month'));
        }
       }
       var diff = to_date - from_date;
       var oneDay = 1000 * 60 * 60 * 24;
       var days = Math.floor(diff / oneDay);
       var hours = (to_date.getHours()) - (from_date.getHours());
       if (days > 0)
       {
        if (hours < 0)
        {
           days--;
           hours += 24;
        }
        if (days > 0)
        {
           if (days >= 7)
           {
            return (Math.floor(days/7) + (Math.floor(days/7)!=1?' weeks':' week'));
           }
           return (days + (days!=1?' days':' day'));
        }
       }
       else if (to_date.getDate() != from_date.getDate())
       {
        hours += 24;
       }
       var minutes = (to_date.getMinutes()) - (from_date.getMinutes());
       if (hours > 0)
       {
        if (minutes < 0)
        {
           hours--;
           minutes += 60;
        }
        if (hours > 0)
        {
           return (hours + (hours!=1?' hours':' hour'));
        }
       }
       var seconds = (to_date.getSeconds()) - (from_date.getSeconds());
       if (minutes > 0)
       {
        if (seconds < 0)
        {
           minutes--;
           seconds += 60;
        }
        if (minutes > 0)
        {
           return (minutes + (minutes!=1?' minutes':' minute'));
        }
       }
       return (seconds + (seconds!=1?' seconds':' second'));
    }
};

var time_ago_in_words = function(date)
{
   return(time_between_in_words(date, new Date()) + " ago");
};
 
var sortPhotos = function(a, b) {
	return ( (parseInt(a.Timestamp) > parseInt(b.Timestamp)) ? -1 : 1);
}

exports.index = function(req, res){
  req.models.Feed.find({user_id: req.session.user.id}, function (err, rows) {
      var feed = rows[0].getFeed()
	  var photos = []
	  var count = 0;	//Use count to call render after all photos have been added (since it's asynchronous)
	  if (feed.length == 0)
	  {
		res.render('index', { authenticated: true, title: 'Feed', currentUser: req.session.user, feed: photos, req: req});
	  }
	  feed.forEach(function(entry) {
		if (entry.type == 'Photo')
		{
		req.models.Photo.get(entry.ID, function(err, photo)
		{
			photo.shared = false;
			photo.extension = photo.Path.split(".")[1];
			photo.getOwner(function(err, user) {
				count++;
				photo.owner_name = user.FullName;
				photo.timeAgo = time_ago_in_words(new Date(parseInt(photo.Timestamp)))
				photos.push(photo);
				if (count == feed.length)
				{
					photos.sort(sortPhotos);
					for ( var i = 0; i < photos.length; i++)
					{
						if (photoIDs.indexOf(photos[i].id) == -1)
						{
							photoIDs.push(photos[i].id);
							uniquePhotos.push(photos[i]);
						}
					}
					photos = uniquePhotos;
					if (!req.query.page)
					{
						req.query.page = 1;
					}
					var nextPage = photos.length > req.query.page*30 ? req.query.page+1 : 0;
					photos = photos.slice((req.query.page-1)*30,req.query.page*30);
					res.render('index', { authenticated: true, currentUser: req.session.user, title: 'Feed', feed: photos, req: req, nextPage: nextPage});
				}
			});
			
		});
		}
		else
		{
		req.models.Share.get(entry.ID, function(err, share)
		{
			share.getPhoto( function(err, photo) {
				photo.Timestamp = share.Timestamp;
				photo.shared = true;
				photo.extension = photo.Path.split(".")[1];
				photo.getOwner(function(err, user) {
					count++;
					photo.owner_name = user.FullName;
					photo.timeAgo = time_ago_in_words(new Date(parseInt(photo.Timestamp)))
					photo.sharer_id = share.sharer_id;
					share.getSharer(function( err, sharer) {
						photo.sharer_name = sharer.FullName;
						photos.push(photo);
						if (count == feed.length)
						{
							photos.sort(sortPhotos);
							uniquePhotos = [];
							photoIDs = [];
							//remove duplicates
							for ( var i = 0; i < photos.length; i++)
							{
								if (photoIDs.indexOf(photos[i].id) == -1)
								{
									photoIDs.push(photos[i].id);
									uniquePhotos.push(photos[i]);
								}
							}
							photos = uniquePhotos;
							if (!req.query.page)
							{
								req.query.page = 1;
							}
							var nextPage = photos.length > req.query.page*30 ? req.query.page+1 : 0;
							photos = photos.slice((req.query.page-1)*30,req.query.page*30);
							res.render('index', { authenticated: true, title: 'Feed', currentUser: req.session.user, feed: photos, req: req, nextPage: nextPage});
						}
					});
				});
			});
			
		});
		}
	  });
        
        });
};

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
				
				//Deal with the asynchronicity (it's a word!)
				var photoCount = 0;
				var shareCount = 0;
				
				req.models.Photo.find({owner_id: id}, function (err, rows) {
					if (rows.length > 0)
					{
					rows.forEach( function(photo) {
						photo.extension = photo.Path.split(".")[1];
						photo.getOwner(function(err, owner) {
							photoCount++;
							photo.owner_name = owner.FullName;
							photo.timeAgo = time_ago_in_words(new Date(parseInt(photo.Timestamp)))
							photos.push(photo);
							if (photoCount == rows.length)
							{
								req.models.Share.find({sharer_id: id}, function (err, rows) {
									if (rows.length > 0)
									{
									rows.forEach( function(share) {
										share.getPhoto( function(err, photo) {
											photo.shared = true;
											photo.sharer_id = share.sharer_id;
											photo.Timestamp = share.Timestamp;
											photo.extension = photo.Path.split(".")[1];
											photo.getOwner(function(err, owner2) {
												shareCount++;
												photo.owner_name = owner2.FullName;
												photo.timeAgo = time_ago_in_words(new Date(parseInt(photo.Timestamp)))
												share.getSharer(function( err, sharer) {
													photo.sharer_name = sharer.FullName;
													photos.push(photo);
													if (shareCount == rows.length)
													{
															photos.sort(sortPhotos);
															uniquePhotos = [];
															photoIDs = [];
															//remove duplicates
															for ( var i = 0; i < photos.length; i++)
															{
																if (photoIDs.indexOf(photos[i].id) == -1)
																{
																	photoIDs.push(photos[i].id);
																	uniquePhotos.push(photos[i]);
																}
															}
															photos = uniquePhotos;
															if (!req.query.page)
															{
																req.query.page = 1;
															}
															var nextPage = photos.length > req.query.page*30 ? req.query.page+1 : 0;
															photos = photos.slice((req.query.page-1)*30,req.query.page*30);
															res.render('stream', { authenticated: true, currentUser: req.session.user, title: 'Stream', id: id, user: user, following: following, photos: photos, nextPage: nextPage});
													}
												});
											});
										});
									});
									}
									else
									{
										photos.sort(sortPhotos);
										uniquePhotos = [];
										photoIDs = [];
										//remove duplicates
										for ( var i = 0; i < photos.length; i++)
										{
											if (photoIDs.indexOf(photos[i].id) == -1)
											{
												photoIDs.push(photos[i].id);
												uniquePhotos.push(photos[i]);
											}
										}
										photos = uniquePhotos;
										if (!req.query.page)
										{
											req.query.page = 1;
										}
										var nextPage = photos.length > req.query.page*30 ? req.query.page+1 : 0;
										photos = photos.slice((req.query.page-1)*30,req.query.page*30);
										res.render('stream', { authenticated: true, currentUser: req.session.user, title: 'Stream', id: id, user: user, following: following, photos: photos, nextPage: nextPage});
									}
								});

							}
						});
					});
					}
					else
					{
						req.models.Share.find({sharer_id: id}, function (err, rows) {
							if (rows.length > 0)
							{
							rows.forEach( function(share) {
								share.getPhoto( function(err, photo) {
									photo.Timestamp = share.Timestamp;
									photo.shared = true;
									photo.sharer_id = share.sharer_id;
									photo.extension = photo.Path.split(".")[1];
									photo.getOwner(function(err, owner) {
										shareCount++;
										photo.owner_name = owner.FullName;
										photo.timeAgo = time_ago_in_words(new Date(parseInt(photo.Timestamp)))
										share.getSharer(function( err, sharer) {
											photo.sharer_name = sharer.FullName;
											photos.push(photo);
											if (shareCount == rows.length)
											{
													photos.sort(sortPhotos);
													uniquePhotos = [];
													photoIDs = [];
													//remove duplicates
													for ( var i = 0; i < photos.length; i++)
													{
														if (photoIDs.indexOf(photos[i].id) == -1)
														{
															photoIDs.push(photos[i].id);
															uniquePhotos.push(photos[i]);
														}
													}
													photos = uniquePhotos;
													if (!req.query.page)
													{
														req.query.page = 1;
													}
													var nextPage = photos.length > req.query.page*30 ? req.query.page+1 : 0;
													photos = photos.slice((req.query.page-1)*30,req.query.page*30);
													res.render('stream', { authenticated: true, currentUser: req.session.user, title: 'Stream', id: id, user: user, following: following, photos: photos, nextPage: nextPage});
											}
										});
									});
								});
							});
							}
							else
							{
								photos.sort(sortPhotos);
								uniquePhotos = [];
								photoIDs = [];
								//remove duplicates
								for ( var i = 0; i < photos.length; i++)
								{
									if (photoIDs.indexOf(photos[i].id) == -1)
									{
										photoIDs.push(photos[i].id);
										uniquePhotos.push(photos[i]);
									}
								}
								photos = uniquePhotos;
								if (!req.query.page)
								{
									req.query.page = 1;
								}
								var nextPage = photos.length > req.query.page*30 ? req.query.page+1 : 0;
								photos = photos.slice((req.query.page-1)*30,req.query.page*30);
								res.render('stream', { authenticated: true, currentUser: req.session.user, title: 'Stream', id: id, user: user, following: following, photos: photos, nextPage: nextPage});
							}
						});
					}
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

exports.share = function(req, res){
// create photo array here
var sharerID = parseInt(req.session.user.id);
var photoID = req.params.id;
var timestamp = new Date().getTime();

req.models.Share.create([
   {
	   sharer_id: sharerID,
	   photo_id: photoID,
	   Timestamp: timestamp
   }], function (err, items) {
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
			res.redirect('/feed');
			res.end();
			}
	})

};
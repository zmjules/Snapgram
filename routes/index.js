
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
           console.log("Error: " + err);
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
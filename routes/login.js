  /*
 * GET login page.
 */
var path = require('path');
var fs = require('fs');

exports.registerPage = function(req, res, errorMessage){
    var err = req.flash('NotValidErr')[0];
    res.render('register', { authenticated: (req.session.user !== null && req.session.user !== undefined), title: 'Register', error: err });
}

exports.registerAction = function(req, res){
    var crypto = require('crypto');
    password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    if ( !req.body.fullName || !req.body.username || !req.body.password )
    {
        req.flash('NotValidErr','Please fill in all fields');
        res.redirect('/users/new');
    }
    else {
      var start = new Date().getTime();
	  req.models.User.find({Username: req.body.username}, function (err, results) {
		  if (err) throw err;
		  else if (results.length > 0)
		  {
			req.flash('NotValidErr','A user with this username already exists');
			res.redirect('/users/new');
		  }
		  else
		  {
		  req.models.User.create([
		  {
			  FullName: req.body.fullName,
			  Username: req.body.username,
			  Password: password,
		  }
		  ], function (err, items) {
			  if (err) 
			  {
				  if (err) throw err;
			  }
			  else
			  {
				  req.session.user = items[0];
				  res.redirect('/feed');
			  }
		  });
		  }
	});
      var end = new Date().getTime();
      var db_time = end - start; 
      console.log("Database access (User table) " + db_time + "ms");

  }
}

exports.loginPage = function(req, res, errorMessage){
    var err = req.flash('NotValidErr')[0];
    res.render('login', {authenticated: (req.session.user !== null && req.session.user !== undefined), title: 'Login', error: err });
};

exports.loginAction = function(req, res){
    var crypto = require('crypto');
    password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    var start = new Date().getTime();
    req.models.User.find({Username: req.body.username}, function(err, rows) {
	   if (err) throw err;
       if (rows.length != 1 || rows[0].Password != password)
       {
           if (rows.length == 0){
              req.flash('NotValidErr','User does not exist');
              res.redirect('/sessions/new');
           }
           else if (rows.length > 1)
              throw new Error('Corrupted database');
           else if (rows[0].Password != password)
		   {
              req.flash('NotValidErr','Incorrect password.');
              res.redirect('/sessions/new');
			}
       }
       else
       {
           req.session.user = rows[0];
           res.redirect('/feed');
       }
    });
    var end = new Date().getTime();
    var db_time = end - start; 
    console.log("Database access (User table) " + db_time + "ms");
}

exports.logoutAction = function(req, res){
    req.session = null;
    res.redirect("/sessions/new");
}

  /*
 * GET login page.
 */
var path = require('path');
var fs = require('fs');

exports.registerPage = function(req, res, errorMessage){
    res.render('register', { authenticated: (req.session.user !== null && req.session.user !== undefined), title: 'Register', error: errorMessage });
}

exports.registerAction = function(req, res){
    var crypto = require('crypto');
    password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    if ( !req.body.fullName || !req.body.username || !req.body.password )
    {
        error = "Please fill in all fields";
        exports.registerPage(req, res, error);
    }
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

exports.loginPage = function(req, res, errorMessage){
    res.render('login', {authenticated: (req.session.user !== null && req.session.user !== undefined), title: 'Login', error: errorMessage });
};

exports.loginAction = function(req, res){
    var crypto = require('crypto');
    password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    req.models.User.find({Username: req.body.username}, function(err, rows) {
	   if (err) throw err;
       if (rows.length != 1 || rows[0].Password != password)
       {
           if (rows.length == 0){
              error = "User does not exist";
           }
           else if (rows.length > 1)
              error = "Multiple users found with this username (corrupted database)";
           else if (rows[0].Password != password)
              error = "Incorrect password";
           exports.loginPage(req, res, error);
       }
       else
       {
           req.session.user = rows[0];
           res.redirect('/feed');
       }
    });
}

exports.logoutAction = function(req, res){
    req.session = null;
    res.redirect("/sessions/new");
}

  /*
 * GET login page.
 */

exports.uploadPage = function(req, res, errorMessage){
    res.render('upload', {user: req.session.user, error: errorMessage });
}

exports.uploadAction = function(req, res, errorMessage){

  // return to upload page if no image provided
  if ( !req.body.image ){
      error = "302 Found. Photo not found.";
      exports.uploadPage(req, res, error);    
  }
  else {
  //TODO: file provided

  }


}

exports.registerPage = function(req, res, errorMessage){
    res.render('register', { title: 'Register', error: errorMessage });
}

exports.registerAction = function(req, res){
    var crypto = require('crypto');
    password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    if ( !req.body.firstName || !req.body.lastName || !req.body.username || !req.body.password )
    {
        error = "Please fill in all fields";
        exports.registerPage(req, res, error);
    }
    req.models.User.create([
    {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Username: req.body.username,
        Password: password,
    }
    ], function (err, items) {
        if (err) 
        {
            error = err.message;
            exports.registerPage(req, res, error);
        }
        else
        {
            req.session.user = items[0];
            res.redirect('/feed');
        }
    });
}

exports.loginPage = function(req, res, errorMessage){
    res.render('login', { title: 'Login', error: errorMessage });
};

exports.loginAction = function(req, res){
    var crypto = require('crypto');
    password = crypto.createHash('sha256').update(req.body.password).digest('hex');
    req.models.User.find({Username: req.body.username}, function(err, rows) {
       if (err || rows.length != 1 || rows[0].Password != password)
       {
           if (rows.length == 0)
              error = "User does not exist";
           else if (rows.length > 1)
              error = "Multiple users found with this username (corrupted database)";
           else if (rows[0].Password != password)
              error = "Incorrect password";
           else
              error = err.message;
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

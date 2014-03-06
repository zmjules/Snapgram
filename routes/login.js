  /*
 * GET login page.
 */
var path = require('path');
var fs = require('fs');

exports.uploadPage = function(req, res, errorMessage){
    res.render('upload', {authenticated: true, error: errorMessage });
}

exports.uploadAction = function(req, res, errorMessage){

  // return to upload page if no image provided
  if ( !req.files.image ){
      error = "302 Found. File Not Found.";
      exports.uploadPage(req, res, error);    
  }
  else {
    var extension = path.extname(req.files.image.originalFilename).substring(1);
    
    // error if an image was not provided
    if (extension != 'jpg' && extension != 'gif' && extension != 'png' && extension != 'tif'){
      error = "302 Found. File Not An Image.";
      exports.uploadPage(req, res, error);   
    }
    // valid image provided 
    else {
      fs.readFile(req.files.image.path, function (err, data) {
      var newPath = "./test/";
      fs.writeFile(newPath, data, function (err) {
        //res.redirect("back");
      });
      });

      // get field values for db
      var userID = parseInt(req.session.user.id);
      var timestamp = new Date().getTime();

      req.models.Photo.create([
      {
        Path: req.files.image.path,
        owner_id: userID,
        Timestamp: timestamp, 
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
                            console.log(items[0]);
                            res.redirect('/photos/new');
                            res.end();
                            }
                    }) 

    //TODO: add 'after create' hook to photo table so that we query the follow table and then add to the feed table 

    } 
  }
}

exports.registerPage = function(req, res, errorMessage){
    res.render('register', { authenticated: (req.session.user !== null && req.session.user !== undefined), title: 'Register', error: errorMessage });
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
    res.render('login', {authenticated: (req.session.user !== null && req.session.user !== undefined), title: 'Login', error: errorMessage });
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

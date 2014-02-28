/*
 * GET login page.
 */

exports.registerPage = function(req, res){
    res.render('register', { title: 'Register' });
}

exports.registerAction = function(req, res){
    
    req.models.User.create([
    {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Username: req.body.username,
        Password: req.body.password,
    }
    ], function (err, items) {
        if (err) 
        {
            console.log(err); 
            res.redirect("/users/new");
        }
        else
        {
            req.session.user = items[0];
            res.redirect('/feed');
        }
    });
}

exports.loginPage = function(req, res){
  res.render('login', { title: 'Login' });
};

exports.loginAction = function(req, res){
    req.models.User.find({Username: req.body.username}, function(err, rows) {
       if (err || rows.length != 1 || rows[0].Password != req.body.password)
       {
           console.log("Failed"); 
           res.redirect("/sessions/new");
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

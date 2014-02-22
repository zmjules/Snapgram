/*
 * GET login page.
 */

exports.registerPage = function(req, res){
    res.render('register', { title: 'Register' });
}

exports.registerAction = function(req, res){
    req.session.username = req.body.username;
    res.redirect('/feed');
}

exports.loginPage = function(req, res){
  res.render('login', { title: 'Login' });
};

exports.loginAction = function(req, res){
    req.session.username = req.body.username;
    res.redirect('/feed');
}
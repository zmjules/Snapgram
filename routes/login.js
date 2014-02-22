/*
 * GET login page.
 */

exports.loginPage = function(req, res){
  res.render('login', { title: 'Express' });
};

exports.loginAction = function(req, res){
    req.session.username = req.body.username;
    res.redirect('/');
}
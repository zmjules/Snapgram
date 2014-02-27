
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Feed', name: req.session.user.FirstName });
};
/*
 * GET login page.
 */

exports.registerPage = function(req, res){
    res.render('register', { title: 'Register' });
}

exports.registerAction = function(req, res){
    mysql = require('mysql');
    conn = mysql.createConnection({
        host: 'localhost',
        user: 's513_b.rougeau',
        password: '10013253',
        database: 's513_b.rougeau'
    });
    conn.connect();
    
    registerUser = "INSERT INTO User (Username, Password, FirstName, LastName) VALUES (?, ?, ?, ?)"
    
    conn.query(registerUser, [req.body.username, req.body.password, req.body.firstName, req.body.lastName], function(err, rows, fields) {
               if (err) 
               {
                console.log(err); 
                res.redirect("/users/new");
               }
               else
               {
                req.session.user = rows[0];
                exports.loginAction(req, res);
               }
               });
}

exports.loginPage = function(req, res){
  res.render('login', { title: 'Login' });
};

exports.loginAction = function(req, res){
    mysql = require('mysql');
    conn = mysql.createConnection({
                                  host: 'localhost',
                                  user: 's513_b.rougeau',
                                  password: '10013253',
                                  database: 's513_b.rougeau'
                                  });
    conn.connect();
    
    findUser = "SELECT * from User where Username = ?"
    
    conn.query(findUser, [req.body.username], function(err, rows, fields) {
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

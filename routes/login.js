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
    
    registerUser = "INSERT INTO User (username, password) VALUES (?, ?)"
    
    conn.query(registerUser, [req.body.username, req.body.password], function(err, rows, fields) {
               if (err) 
               {
                console.log(err); 
                res.redirect("/users/new");
               }
               else
               {
                req.session.username = req.body.username;
                res.redirect('/feed');
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
    
    findUser = "SELECT password from User where username = ?"
    
    conn.query(findUser, [req.body.username], function(err, rows, fields) {
               if (err || rows.length < 1 || rows[0].password != req.body.password) 
               {
               console.log("Failed"); 
               res.redirect("/sessions/new");
               }
               else
               {
               req.session.username = req.body.username;
               res.redirect('/feed');
               }
               });
}
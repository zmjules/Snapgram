/** Run this on your local machine after installing mysql to get the same
 database and user we'll use on the live server (before trying to set up the
 database schema)
 */
mysql = require('mysql');
conn = mysql.createConnection({
                              host: 'localhost',
                              user: 'root',
                              password: ''
                              });

conn.connect();

conn.query('GRANT CREATE ON *.* TO `root`@`localhost`', function(err, results) {
           if (err) throw err;
           
           console.log('Gave root permission to create databases');
           });

conn.query('CREATE DATABASE `s513_b.rougeau`', function(err, results) {
           if (err) throw err;
           
           console.log('Created database');
           });

conn.query("GRANT USAGE ON *.* TO `s513_b.rougeau`@`localhost` IDENTIFIED BY '10013253'", function(err, results) {
           if (err) throw err;
           
           console.log('Created user');
           });

conn.query('GRANT ALL PRIVILEGES ON `s513_b.rougeau`.* to `s513_b.rougeau`@`localhost`', function(err, results) {
           if (err) throw err;
           
           console.log('Gave user privileges to database');
           });

conn.end();
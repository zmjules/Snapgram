userTable = "CREATE TABLE User (\
                     `username` VARCHAR(50) NOT NULL PRIMARY KEY,\
                     `password` VARCHAR(50)\
                     );"


mysql = require('mysql');
conn = mysql.createConnection({
                              host: 'localhost',
                              user: 's513_b.rougeau',
                              password: '10013253',
                              database: 's513_b.rougeau'
                              });

conn.connect();

conn.query(userTable, function(err, rows, fields) {
           if (err) throw err;
           
           console.log('Created users table');
           });

conn.end();

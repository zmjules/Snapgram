userTable = "CREATE TABLE User (\
                     `ID` INT NOT NULL AUTO_INCREMENT,\
                     `Username` VARCHAR(50) UNIQUE,\
                     `Password` VARCHAR(50),\
                     `FirstName` VARCHAR(50),\
                     `LastName` VARCHAR(50),\
                     PRIMARY KEY (ID)\
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

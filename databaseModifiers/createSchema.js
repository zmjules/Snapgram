dropTables = "DROP TABLE IF EXISTS Photo, Follow, Feed, User;"

userTable = "CREATE TABLE User (\
                     `ID` INT NOT NULL AUTO_INCREMENT,\
                     `Username` VARCHAR(50) UNIQUE,\
                     `Password` VARCHAR(300),\
                     `FirstName` VARCHAR(50),\
                     `LastName` VARCHAR(50),\
                     PRIMARY KEY (ID)\
                     );"

photoTable = "CREATE TABLE Photo (\
                `ID` INT NOT NULL AUTO_INCREMENT,\
                `Path` VARCHAR(300),\
                `owner_id` INT,\
                `Timestamp` INT,\
                PRIMARY KEY (ID),\
                FOREIGN KEY (Owner_id) REFERENCES User(ID)\
                );"


followTable = "CREATE TABLE Follow (\
                `ID` INT NOT NULL AUTO_INCREMENT,\
                `follower_id` INT,\
                `followee_id` INT,\
                PRIMARY KEY (ID),\
                FOREIGN KEY (Follower_id) REFERENCES User(ID),\
                FOREIGN KEY (Followee_id) REFERENCES User(ID)\
                );"

feedTable = "CREATE TABLE Feed (\
                `user_id` INT NOT NULL AUTO_INCREMENT,\
                `FeedList` VARCHAR(1000),\
                PRIMARY KEY (User_id),\
                FOREIGN KEY (User_id) REFERENCES User(ID)\
            );"


mysql = require('mysql');
conn = mysql.createConnection({
                              host: 'localhost',
                              user: 's513_b.rougeau',
                              password: '10013253',
                              database: 's513_b.rougeau'
                              });

conn.connect();

conn.query(dropTables, function(err, rows, fields) {
           if (err) throw err;
           
           console.log('Dropped stale tables');
           });

conn.query(userTable, function(err, rows, fields) {
           if (err) throw err;
           
           console.log('Created users table');
           });

conn.query(photoTable, function(err, rows, fields) {
           if (err) throw err;
           
           console.log('Created photo table');
           });

conn.query(followTable, function(err, rows, fields) {
           if (err) throw err;
           
           console.log('Created follow table');
           });

conn.query(feedTable, function(err, rows, fields) {
           if (err) throw err;
           
           console.log('Created feed table');
           });

conn.end();

mysql = require('mysql');
conn = mysql.createConnection({
  host: 'localhost',
  user: 's513_b.rougeau',
  password: '10013253',
  database: 's513_b.rougeau'
});

conn.connect();

conn.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

conn.end();

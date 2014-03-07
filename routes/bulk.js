
/*
 * bulk data operations
 */

exports.clear = function(req, res){
	if (req.query.password == "zorodi")
	{
		userClear = "DELETE FROM User"
		photoClear = "DELETE FROM Photo"
		followClear = "DELETE FROM Follow"
		feedClear = "DELETE FROM Feed"

		mysql = require('mysql');
		conn = mysql.createConnection({
			host: 'localhost',
			user: 's513_b.rougeau',
			password: '10013253',
			database: 's513_b.rougeau'
		});

		conn.connect();

		conn.query(userClear, function(err, rows, fields) {
		   if (err) throw err;
		});
		
		conn.query(photoClear, function(err, rows, fields) {
		   if (err) throw err;
		});
		
		conn.query(followClear, function(err, rows, fields) {
		   if (err) throw err;
		});
		
		conn.query(feedClear, function(err, rows, fields) {
		   if (err) throw err;
		});

		conn.end();

		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('DB cleared');
	}
	else
	{
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Incorrect password, no action taken');
	}
};

exports.users = function(req, res){
	if (req.query.password == "zorodi")
	{
		var crypto = require('crypto');
		for (var i = 0; i < req.body.length; i++)
		{
			password = crypto.createHash('sha256').update(req.body[i].password).digest('hex');
			req.models.User.create([
			{
				id: req.body[i].id,
				FirstName: "Ju",
				LastName: "Kobra",
				Username: req.body[i].name,
				Password: password
			}
			], function (err, items) {
				if (err) 
				{
					error = err.message;
				}
			});
			console.log(req.body[i]);
			for (var j = 0; j < req.body[i].follows.length; j++)
			{
				req.models.Follow.create([
				{
					follower_id: req.body[i].id,
					followee_id: req.body[i].follows[j]
				}
				], function (err, items) {
					if (err) 
					{
						error = err.message;
						console.log(error);
					}
				});
			}
		}

		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Added users');
	}
	else
	{
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Incorrect password, no action taken');
	}
};

var loadPhotosIndividually = function(req, photos, i)
{
	req.models.Photo.create([
	{
		id: photos[i].id,
		owner_id: photos[i].user_id,
		Path: photos[i].path,
		Timestamp: photos[i].timestamp
	}
	], function (err, items) {
		if (err) 
		{
			error = err.message;
			if (i+1 < photos.length)
				loadPhotosIndividually(req, photos, i+1);
		}
	});
}

exports.photos = function(req, res){
	if (req.query.password == "zorodi")
	{
		var crypto = require('crypto');
		for (var i = 0; i < req.body.length; i++)
		{
			loadPhotosIndividually(req, req.body, 0);
		}

		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Added photos');
	}
	else
	{
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Incorrect password, no action taken');
	}
};
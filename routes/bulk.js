
/*
 * bulk data operations
 */

exports.clear = function(req, res){
	if (req.query.password == "zorodi")
	{
		var finished = 0;
		userClear = "DELETE FROM User"
		photoClear = "DELETE FROM Photo"
		followClear = "DELETE FROM Follow"
		feedClear = "DELETE FROM Feed"
		shareClear = "DELETE FROM Share"

		mysql = require('mysql');
		conn = mysql.createConnection({
			host: 'localhost',
			user: 's513_b.rougeau',
			password: '10013253',
			database: 's513_b.rougeau'
		});

		conn.connect();

		conn.query(userClear, function(err, rows, fields) {
			finished++;
		   if (err) throw err;
		   if (finished == 5)
		   {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('DB cleared');
		   }
		});
		
		conn.query(photoClear, function(err, rows, fields) {
			finished++;
		   if (err) throw err;
		   if (finished == 5)
		   {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('DB cleared');
		   }
		});
		
		conn.query(followClear, function(err, rows, fields) {
			finished++;
		   if (err) throw err;
		   if (finished == 5)
		   {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('DB cleared');
		   }
		});
		
		conn.query(feedClear, function(err, rows, fields) {
			finished++;
		   if (err) throw err;
		   if (finished == 5)
		   {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('DB cleared');
		   }
		});
		
		conn.query(shareClear, function(err, rows, fields) {
			finished++;
		   if (err) throw err;
		   if (finished == 5)
		   {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('DB cleared');
		   }
		});

		conn.end();
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
		numberOfUsers = req.body.length
		numUsersDone = 0
		for (var i = 0; i < req.body.length; i++)
		{
			followers = req.body[i].follows
			userID = req.body[i].id
			password = crypto.createHash('sha256').update(req.body[i].password).digest('hex');
			req.models.User.create([
			{
				id: req.body[i].id,
				FullName: "Bulk User",
				Username: req.body[i].name,
				Password: password
			}
			], function (err, items) {
				if (err) throw err;
				console.log(req.body[i]);
				for (var j = 0; j < followers.length; j++)
				{
					req.models.Follow.create([
					{
						follower_id: userID,
						followee_id: followers[j]
					}
					], function (err, items) {
						if (err) throw err;
						if (j == followers.length)
						{
							numUsersDone++;
							if (numUsersDone == numberOfUsers)
							{
								res.writeHead(200, {'Content-Type': 'text/plain'});
								res.end('Added users');
							}
						}
					});
				}
			});
		}
	}
	else
	{
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Incorrect password, no action taken');
	}
};

var loadPhotosIndividually = function(req, photos, res, i)
{
	req.models.Photo.create([
	{
		id: photos[i].id,
		owner_id: photos[i].user_id,
		Path: photos[i].path,
		Timestamp: photos[i].timestamp
	}
	], function (err, items) {
		if (err) throw err;
		if (i+1 < photos.length)
			loadPhotosIndividually(req, photos, res, i+1);
		else
		{
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end('Added photos');
		}
	});
}

exports.photos = function(req, res){
	if (req.query.password == "zorodi")
	{
		var crypto = require('crypto');
		loadPhotosIndividually(req, req.body, res, 0);
	}
	else
	{
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Incorrect password, no action taken');
	}
};
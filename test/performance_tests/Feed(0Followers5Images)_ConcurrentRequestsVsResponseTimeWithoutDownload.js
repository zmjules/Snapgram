var http = require('http')
var querystring = require('querystring')
var path = require('path')

var sessionID = ''
var requestsCompleted = 0;
var startTime;

var createRequest = function(requestNum, totalRequests)
{
	var options = {
		host: "localhost",
		port: 8053,
		path: "/feed",
		method: 'GET',
		headers: {'Cookie': 'sid=' + sessionID}
	}
	var request = http.request(options)

	// set up an event listener to handle a response
	request.on('response', function(response) {
		// we are expecting utf8 encoded data
		response.setEncoding('utf8')
		// set up an event listener to be called when each
		// chunk of data arrives
		response.on('data', function(data) {
		})
		// set up an event listener to be called when response
		// is complete
		response.on('end', function() {
			requestsCompleted++;
			if (requestsCompleted == totalRequests)
			{
				console.log(totalRequests + ',' + (new Date() - startTime));
				if (totalRequests < 100)
					createRequests(totalRequests+1);
			}
				
		});
	});
	
	// set up an event listener to handle any error
	request.on('error', function(e) {
		console.log("error");
	});
	// complete the request
	request.end()
}

var createRequests = function(totalRequests)
{
	requestsCompleted = 0;
	startTime = new Date();
	for (var i = 0; i < totalRequests; i++)
	{
		createRequest(i, totalRequests)
	}
}

var login = function()
{
	var options = {
		host: "localhost",
		port: 8053,
		path: "/sessions/create",
		method: 'POST'
	}
	var post_data = querystring.stringify({
	  username: "john",
	  password: "5678"
	});
	options.method = "POST";
	options.headers = {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Length': post_data.length
					 }
	var request = http.request(options)

	// set up an event listener to handle a response
	request.on('response', function(response) {
		// we are expecting utf8 encoded data
		response.setEncoding('utf8')
		// set up an event listener to be called when each
		// chunk of data arrives
		response.on('data', function(data) {
		})
		// set up an event listener to be called when response
		// is complete
		response.on('end', function() {
			//Ugly code to get session cookie
			sessionID = response.headers['set-cookie'][0].split('sid=')[1].split(';')[0];
			createRequests(1);
			//and the user ID
			/**firstUserID = response.headers['set-cookie'][0].split('id%22%3A')[1].split('%7D%7D')[0];*/
		});
	});
	
	// set up an event listener to handle any error
	request.on('error', function(e) {
		console.log("error");
	})
	request.write(post_data);
	// complete the request
	request.end()
}

var createPhotos = function()
{
	var jsonPhotos = JSON.stringify([{id: 20, user_id: 1, path: path.normalize(__dirname + './image.png'), timestamp: 1234}, {id: 21, user_id: 1, path: path.normalize(__dirname + './image.png'), timestamp: 5678}, {id: 22, user_id: 1, path: path.normalize(__dirname + './image.png'), timestamp: 1234}, {id: 23, user_id: 1, path: path.normalize(__dirname + './image.png'), timestamp: 1234}, {id: 24, user_id: 1, path: path.normalize(__dirname + './image.png')}]);
	
	var options = {
	   host: 'localhost',
	   port: 8053,
	   path: '/bulk/photos?password=zorodi',
	   method: 'POST',
	   headers: {
			'Content-Type': "application/json; charset=utf-8",
			'Content-Length': Buffer.byteLength(jsonPhotos)
		}
	}
	var request = http.request(options);
	request.on('response', function(response) {
		response.on('data', function(data) {
		})
		response.on('end', function(chunk) {
			login();
		});
	 });
	 request.write(jsonPhotos);

	 // complete the request
	 request.end()
}

var createUsers = function()
{
	var jsonUsers = JSON.stringify([{'id': 1, 'name': 'john', follows: [], password: '5678'}]);
	
	var options = {
	   host: 'localhost',
	   port: 8053,
	   path: '/bulk/users?password=zorodi',
	   method: 'POST',
	   headers: {
			'Content-Type': "application/json; charset=utf-8",
			'Content-Length': Buffer.byteLength(jsonUsers)
		}
	}
	var request = http.request(options);
	request.on('response', function(response) {
		response.on('data', function(data) {
		})
		response.on('end', function(chunk) {
			createPhotos();
		});
	 });
	 request.write(jsonUsers);

	 // complete the request
	 request.end()
}

var clearDatabase = function()
{
	var options = {
		host: "localhost",
		port: 8053,
		path: "/bulk/clear?password=zorodi",
		method: 'GET'
	}
	var request = http.request(options);
	var fullData = '';

	// set up an event listener to handle a response
	request.on('response', function(response) {
		// we are expecting utf8 encoded data
		response.setEncoding('utf8')
		// set up an event listener to be called when each
		// chunk of data arrives
		response.on('data', function(data) {
			fullData += data;
		})
		// set up an event listener to be called when response
		// is complete
		response.on('end', function() {
			createUsers();
		});
	});

	// set up an event listener to handle any error
	request.on('error', function(e) {
		console.log("error");
	})
	// complete the request
	request.end()
}

clearDatabase();
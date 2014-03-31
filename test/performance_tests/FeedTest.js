var http = require('http')
var querystring = require('querystring')
var fs = require("fs");

var sessionID = ''
var photosLoaded = {};
var startTime;
var num = 1;
var numOut = 0;	// track number of requests sent
var numBack = 0; // track number of requests returned

var createRequest = function(requestNum, totalRequests, timeOut)
{

	var localNum = num;
	console.log('sending request #: ' + localNum);

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
			numBack++; // keep track of number of requests back in

			// calculate time
			var timeRec = new Date();
			var timeDiff = timeRec.valueOf() - timeOut.valueOf();

			console.log('Num: ' + localNum + " took " + timeDiff);

			requestsCompleted++;
			if (requestsCompleted == totalRequests)
			{
				console.log('Total Time: ' + (new Date() - startTime));
				if (totalRequests < 50){
					createRequests(totalRequests+1);
				}
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
		var timeOut = new Date();
		createRequest(i, totalRequests, timeOut);
		num++;
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
	  username: "octavia.overbay",
	  password: "Octavia"
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
			createRequests(50);
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

var createUsers = function()
{
	fs.readFile('users.json', 'utf8', function (err, data) {
	  if (err) {
		console.log('Error: ' + err);
		return;
	  }
	 
	  data = JSON.parse(data);
	  jsonUsers = JSON.stringify(data);
	
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
				login();
			});
		 });

		 // complete the request
		 request.end(jsonUsers);
	 });
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
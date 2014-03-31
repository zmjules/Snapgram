//NOTE: YOU MUST RUN PART 1 FIRST TO SET UP THE DATABASE, THE LAST CALL FOR PART 1 WILL TIME OUT. WAIT UNTIL THE DATABASE FINISHES SETTING UP BEFORE 
//STARTING PART 2

var http = require('http')
var querystring = require('querystring')
var path = require('path')
var fs = require('fs')

var sessionID = ''
var startTime;

var loadFeed = function(numPhotos, data)
{
	fullData = '';
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
				console.log(numPhotos + ',' + (new Date() - startTime));
				if (numPhotos < 98)
					makeRequest(numPhotos+1, data);
		});
	});
	
	// set up an event listener to handle any error
	request.on('error', function(e) {
		console.log("error");
	});
	// complete the request
	request.end()
}

var login = function(numPhotos, userInfo, data)
{
	var options = {
		host: "localhost",
		port: 8053,
		path: "/sessions/create",
		method: 'POST'
	}
	var post_data = querystring.stringify({
	  username: userInfo['name'],
	  password: userInfo['password']
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
			startTime = new Date();
			loadFeed(numPhotos, data);
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


var makeRequest = function(numPhotos, data)
{
	login(numPhotos, data[numPhotos], data);
}

fs.readFile('usersNoFollow.json', 'utf8', function (err, data) {
	  if (err) {
		console.log('Error: ' + err);
		return;
	  }
	 
	data = JSON.parse(data);
	makeRequest(0, data);
});
var http = require('http')
var querystring = require('querystring')
var path = require('path')
var fs = require('fs')


var createPhotos = function(userData)
{
	fs.readFile('photos.json', 'utf8', function (err, data) {
	  if (err) {
		console.log('Error: ' + err);
		return;
	  }
	 
	  data = JSON.parse(data);
	  jsonPhotos = JSON.stringify(data);
	
		var options = {
		   host: 'localhost',
		   port: 8050,
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
				return
			});
		 });

		 // complete the request (this will time out)
		 request.end(jsonPhotos);
	 });
}

var createUsers = function()
{
	fs.readFile('usersNoFollow.json', 'utf8', function (err, data) {
	  if (err) {
		console.log('Error: ' + err);
		return;
	  }
	 
	  data = JSON.parse(data);
	  jsonUsers = JSON.stringify(data);
	
		var options = {
		   host: 'localhost',
		   port: 8050,
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
				createPhotos(data);
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
		port: 8050,
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
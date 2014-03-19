// Functional Tests for Requirement 4 -- Redirect to login form
//
// Cases: 
//		User is logged in -> Go to feed (200 response)
//		User is not logged in -> Redirect to login page (302 with location /sessions/new)

var index = require("../routes/index")
var assert = require("assert")
var http = require("http")
var querystring = require("querystring")

var testLoggedOut1 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/",
	}
	
	describe('Not logged in and path = /', function(){
		it('should return: StatusCode - 302, Path - /sessions/new', function(done){
			var request = http.request(options)

		// set up an event listener to handle a response
		request.on('response', function(response) {
			responsePath = response.headers['location'];

			// we are expecting utf8 encoded data
			response.setEncoding('utf8')
			// set up an event listener to be called when each
			// chunk of data arrives
			response.on('data', function(data) {
			})
			// set up an event listener to be called when response
			// is complete
			response.on('end', function() {
				assert.equal(302, response.statusCode);
				assert.deepEqual('/sessions/new', responsePath); // check to ensure path is correct
				done();
			});
		});
		
		// set up an event listener to handle any error
		request.on('error', function(e) {
			console.log("error");
		})
		// complete the request
		request.end()

	});
});
}

var register = function() {
	// clear database


	describe('Registering', function(){
	it('should return 302 and a session cookie', function(done){
		var post_data = querystring.stringify({
		  fullName: "Test User",
		  username: "testUser",
		  password: "testPass"
		});
		options.path = "/users/create";
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
				console.log('in data');
				console.log(data);
			})
			// set up an event listener to be called when response
			// is complete
			response.on('end', function() {
				console.log(Date.now() - x);
				assert.equal(302, response.statusCode);
				done();
					
			});
		});
		
		// set up an event listener to handle any error
		request.on('error', function(e) {
			console.log("error");
		})
		x = Date.now();
		request.write(post_data);
		// complete the request
		request.end()
	});
	});
}

var testLoggedIn1 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/",
	}
	
	describe('Not logged in and path = /', function(){
		it('should return: StatusCode - 302, Path - /sessions/new', function(done){
			var request = http.request(options)

		// set up an event listener to handle a response
		request.on('response', function(response) {
			responsePath = response.headers['location'];

			// we are expecting utf8 encoded data
			response.setEncoding('utf8')
			// set up an event listener to be called when each
			// chunk of data arrives
			response.on('data', function(data) {
			})
			// set up an event listener to be called when response
			// is complete
			response.on('end', function() {
				assert.equal(200, response.statusCode);
				assert.deepEqual('/feed', responsePath); // check to ensure path is correct
				done();
			});
		});
		
		// set up an event listener to handle any error
		request.on('error', function(e) {
			console.log("error");
		})
		// complete the request
		request.end()

	});
});
}

// RUN TESTS
testLoggedOut1();
register();
testLoggedIn1();





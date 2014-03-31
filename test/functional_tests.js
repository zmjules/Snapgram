// Functional Tests for Requirement 4 -- Redirect to login form
//
// We have also included some bonus tests that ensure links work properly for logged in users
//


var index = require("../routes/index")
var assert = require("assert")
var http = require("http")
var querystring = require("querystring")

var sessionID = '';

// Test: Not logged in and path is /.
// Expected Result: 302 Status Code and redirect to /sessions/new for possible login or sign up through link
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

// Test: Not logged in and path is /sessions/new.
// Expected Result: 200 Status Code (user is allowed to log in without being logged in, obviously)
var testLoggedOut2 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/sessions/new",
	}
	
	describe('Not logged in and path = /sessions/new', function(){
		it('should return: StatusCode - 200', function(done){
			var request = http.request(options)

		// set up an event listener to handle a response
		request.on('response', function(response) {
			responsePath = response.headers;

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

// Test: Not logged in and path is /users/new.
// Expected Result: 200 Status Code (user is allowed to signup without being logged in, obviously)
var testLoggedOut3 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/users/new",
	}
	
	describe('Not logged in and path = /users/new', function(){
		it('should return: StatusCode - 200', function(done){
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

// Test: Not logged in and path is /feed.
// Expected Result: 302 Status Code and redirect to /sessions/new
var testLoggedOut4 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/feed",
	}
	
	describe('Not logged in and path = /feed', function(){
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

// Test: Not logged in and path is /photos/new.
// Expected Result: 302 Status Code and redirect to /sessions/new
var testLoggedOut5 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/photos/new",
	}
	
	describe('Not logged in and path = /photos/new', function(){
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

// Test: Not logged in and path is /users/1.
// Expected Result: 302 Status Code and redirect to /sessions/new
var testLoggedOut6 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/users/1",
	}
	
	describe('Not logged in and path = /users/1', function(){
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

// Test: Not logged in and invalid path.
// Expected Result: 302 Status Code and redirect to /sessions/new
var testLoggedOut7 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/invalidPath",
	}
	
	describe('Not logged in and path = /invalidPath', function(){
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

// copied from other code -- tests are run again for ease of use
// necessary for testing logged in cases
var register = function() {
	// clear database
	var options = {
		host: "localhost",
		port: 8050,
		path: "/bulk/clear?password=zorodi",
		method: 'GET'
	}
	
	describe('Clearing database using bulk clear', function() {
	it('should return message indicating sucess', function(done){
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
				assert.equal(200, response.statusCode);
				assert.equal('DB cleared', fullData);
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

	describe('Opening Registration Form', function(){
	it('should return the registration page', function(done){
	   options.path = "/users/new";
	   var request = http.request(options)
	   var x = 0;
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
					assert.equal(200, response.statusCode);
					var formData = fullData.split('<form ')[1].split('</form>')[0]
					assert.equal('method="post" action="/users/create"><p class="bodytext"><label>Full Name&nbsp</label><input type="text" name="fullName"></p><p class="bodytext"><label>Username&nbsp</label><input type="text" name="username"></p><p class="bodytext"><label>Password&nbsp</label><input type="password" name="password"></p><p><input type="submit" name="submit" value="Sign up"></p>', formData);
					done();
			});
		});
		
		// set up an event listener to handle any error
		request.on('error', function(e) {
			console.log("error");
		})
		x = Date.now();
		// complete the request
		request.end()
	});
	});
	
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
			response.on('data', function() {
			})
			// set up an event listener to be called when response
			// is complete
			response.on('end', function() {
				//Ugly code to get session cookie
				sessionID = response.headers['set-cookie'][0].split('sid=')[1].split(';')[0];
				assert.equal('/feed', response.headers['location']);
				assert.equal(302, response.statusCode);
				done();
			});
		});
		
		// set up an event listener to handle any error
		request.on('error', function(e) {
			console.log("error");
		})
		request.write(post_data);
		// complete the request
		request.end()
	});
	});
}

// Test: Logged in and path is /feed.
// Expected Result: 200 Status Code
var testLoggedIn1 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/feed",
		method: 'GET',
	}
	
	describe('Logged in and path = /feed', function(){
		it('should return: StatusCode - 200', function(done){
			options.headers = {
							  'Cookie': 'sid=' + sessionID
						  }

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

// Test: Logged in and path is invalid.
// Expected Result: 404 Status Code
var testLoggedIn2 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/invalidPath",
		method: 'GET',
	}
	
	describe('Logged in and path = /invalidPath', function(){
		it('should return: StatusCode - 404', function(done){
			options.headers = {
							  'Cookie': 'sid=' + sessionID
						  }

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
				assert.equal(404, response.statusCode);
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

// Test: Logged in and path is /photos/new (image upload)
// Expected Result: 200 Status Code
var testLoggedIn3 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/photos/new",
		method: 'GET',
	}
	
	describe('Logged in and path = /photos/new', function(){
		it('should return: StatusCode - 200', function(done){
			options.headers = {
							  'Cookie': 'sid=' + sessionID
						  }

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


// Test: Logged in and path is /sessions/new
// Expected Result: 200 Status Code
var testLoggedIn4 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/sessions/new",
		method: 'GET',
	}
	
	describe('Logged in and path = /sessions/new', function(){
		it('should return: StatusCode - 200', function(done){
			options.headers = {
							  'Cookie': 'sid=' + sessionID
						  }

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

// Test: Logged in and path is /users/new
// Expected Result: 200 Status Code
var testLoggedIn5 = function(){

	var responsePath;

	var options = {
		host: "localhost",
		port: 8050,
		path: "/users/new",
		method: 'GET',
	}
	
	describe('Logged in and path = /users/new', function(){
		it('should return: StatusCode - 200', function(done){
			options.headers = {
							  'Cookie': 'sid=' + sessionID
						  }

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

// --------- RUN TESTS --------- //
testLoggedOut1();
testLoggedOut2();
testLoggedOut3();
testLoggedOut4();
testLoggedOut5();
testLoggedOut6();
testLoggedOut7();

// database is cleared
// register a test user for cases where user is logged in
register();

// continue with bonus tests for logged in user
testLoggedIn1();
testLoggedIn2();
testLoggedIn3();
testLoggedIn4();
testLoggedIn5();





// Functional Tests for Requirement 4 -- Redirect to login form
//
// Cases: 
//		User is logged in -> Go to feed (200 response)
//		User is not logged in -> Redirect to login page (302 with location /sessions/new)

var index = require("../routes/index")
var assert = require("assert")
var http = require("http")
var querystring = require("querystring")

var testRequest1 = function(pathIn, testNum){

	var options = {
		host: "localhost",
		port: 8050,
		path: "/",
	}
	
	describe('Not logged in and path = /', function(){
		it('should return 302 status code', function(done){
			var request = http.request(options)
			var fullData = '';

		// set up an event listener to handle a response
		request.on('response', function(response) {
			// we are expecting utf8 encoded data
			response.setEncoding('utf8')
			// set up an event listener to be called when each
			// chunk of data arrives
			response.on('data', function(data) {
				console.log('in data');
				fullData += data;
			})
			// set up an event listener to be called when response
			// is complete
			response.on('end', function() {
				assert.equal(302, response.statusCode);
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




/*
var returnCode = 0;

	var options = {
		host: 'localhost',
		port: 8050,
		path: pathIn
	}

	var request = http.request(options); // make the request
	var responsePath;

	//listen for response
	request.on('response', function(response) {
		returnCode = response.statusCode;
		
		switch(testNum)
		{
			case 1:
			describe('not logged in path = /', function(){
				it('response should be 302', function(){
					assert.equal(302, returnCode);
				})
			})	
			break;
			case 2:
			describe('not logged in and path does not exist', function(){
				it('response should be 302', function(){
					assert.equal(302, returnCode);
				})
			})	
			break;
			default:
			//
		}

		response.on('data', function() {
			// empty... necessary to function
		})

		// when response is done...
		response.on('end', function(){
			
		})
	})

	request.on('error', function(){
		console.log('some error');
	})

	request.end();
	*/

// RUN TESTS
testRequest1();





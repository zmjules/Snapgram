// Functional Tests for Requirement 4 -- Redirect to login form
//
// Cases: 
//		User is logged in -> Go to feed (200 response)
//		User is not logged in -> Redirect to login page (302 with location /sessions/new)

var http = require("http");
var assert = require("assert")

var testRequest = function(pathIn, testNum){

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
}


// RUN TESTS
testRequest('/', 1);
testRequest('/blah', 2);





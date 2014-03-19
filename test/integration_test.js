var index = require("../routes/index")
var assert = require("assert")
var http = require("http")
var querystring = require("querystring")

var makeInitialRequest = function()
{
	console.log('test2');

	var options = {
		host: "localhost",
		port: 8050,
		path: "/users/new",
		method: 'GET'
	}
	
	describe('Opening Registration Form', function(){
	it('should return the registration page', function(done){
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
				console.log('in data');
				fullData += data;
			})
			// set up an event listener to be called when response
			// is complete
			response.on('end', function() {
					console.log(Date.now() - x);
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
		options.path = "/users/create";
		options.method = "POST";
		var request = http.request(options)
	
		// set up an event listener to handle a response
		request.on('response', function(response) {
			// we are expecting utf8 encoded data
			response.setEncoding('utf8')
			// set up an event listener to be called when each
			// chunk of data arrives
			response.on('data', function() {
				console.log('in data');
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
		var data = querystring.stringify({
		  fullName: "Test User",
		  username: "testUser",
		  password: "testPass"
		});
		request.write(data);
		// complete the request
		request.end()
	});
	});

}

console.log('test');
makeInitialRequest();
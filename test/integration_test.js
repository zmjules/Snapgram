var index = require("../routes/index")
var assert = require("assert")
var http = require("http")
var querystring = require("querystring")
var FormData = require('form-data')
var fs = require('fs')
var path = require('path')

var makeInitialRequest = function()
{

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
					//console.log(Date.now() - x);
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
	
	sessionID = ''
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
	
	/**describe('Logging out', function(){
	it('should return 302 and an instruction to delete session cookie', function(done){
		this.timeout(20000);
		options.path = "/sessions/end";
		options.method = "GET";
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
				console.log(response.headers['set-cookie'])
				//Ugly code to get session cookie
				//sessionID = response.headers['set-cookie'][0].split('sid=')[1].split(';')[0];
				
				assert.equal('/sessions/new', response.headers['location']);
				assert.equal(302, response.statusCode);
				done();
			});
		});
		
		// set up an event listener to handle any error
		request.on('error', function(e) {
			console.log("error");
		})
		console.log('');
		// complete the request
		request.end()
	});
	});*/
	
	describe('Reading Feed', function(){
	it('should return 200 and no photos', function(done){
		fullData = ''
		options.path = "/feed";
		options.method = "GET";
		options.headers = {
							  'Cookie': 'sid=' + sessionID
						  }
		var request = http.request(options)
	
		// set up an event listener to handle a response
		request.on('response', function(response) {
			// we are expecting utf8 encoded data
			response.setEncoding('utf8')
			// set up an event listener to be called when each
			// chunk of data arrives
			response.on('data', function(data) {
				fullData += data
			})
			// set up an event listener to be called when response
			// is complete
			response.on('end', function() {
				var imageCount = (fullData.match(/thumbContainer/g) || []).length
				assert.equal(0, imageCount);
				assert.equal(200, response.statusCode);
				done();
					
			});
		});
		
		// set up an event listener to handle any error
		request.on('error', function(e) {
			console.log("error");
		});
		// complete the request
		request.end()
	});
	});
	
	describe('Uploading Photo', function(){
	it('should return 302 with redirect location being feed', function(done){
		var form = new FormData();
		form.append("image", fs.createReadStream(path.join(__dirname, "image.png")));
		options.path = "/photos/create";
		options.method = "POST";
		options.headers = form.getHeaders()
		options.headers['Cookie'] = 'sid=' + sessionID
		var request = http.request(options)
	
		// set up an event listener to handle a response
		request.on('response', function(response) {
			// we are expecting utf8 encoded data
			response.setEncoding('utf8')
			// set up an event listener to be called when each
			// chunk of data arrives
			response.on('data', function(data) {
				fullData += data
			})
			// set up an event listener to be called when response
			// is complete
			response.on('end', function() {
				assert.equal(302, response.statusCode);
				assert.equal('/feed', response.headers['location']);
				done();
					
			});
		});
		
		// set up an event listener to handle any error
		request.on('error', function(e) {
			console.log("error");
		});
		form.pipe(request);
	});
	});
	
	describe('Reading Feed', function(){
	it('should return 200 and one photo', function(done){
		fullData = ''
		options.path = "/feed";
		options.method = "GET";
		options.headers = {
							  'Cookie': 'sid=' + sessionID
						  }
		var request = http.request(options)
	
		// set up an event listener to handle a response
		request.on('response', function(response) {
			// we are expecting utf8 encoded data
			response.setEncoding('utf8')
			// set up an event listener to be called when each
			// chunk of data arrives
			response.on('data', function(data) {
				fullData += data
			})
			// set up an event listener to be called when response
			// is complete
			response.on('end', function() {
				var imageCount = (fullData.match(/thumbContainer/g) || []).length
				assert.equal(1, imageCount);
				assert.equal(200, response.statusCode);
				done();
					
			});
		});
		
		// set up an event listener to handle any error
		request.on('error', function(e) {
			console.log("error");
		});
		// complete the request
		request.end()
	});
	});

}

makeInitialRequest();
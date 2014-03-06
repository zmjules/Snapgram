var http = require('http'),
 querystring = require('querystring')
 
var jsonUsers = JSON.stringify([{id: 1, name: 'steve', follows: [], password: '1234'}, {'id': 5, 'name': 'darren', follows: [1,3,4], password: '5678'}]);

 var options = {
   host: 'localhost',
   port: 3000,
   path: '/bulk/users?password=zorodi',
   method: 'POST',
   headers: {
        'Content-Type': "application/json; charset=utf-8",
        'Content-Length': Buffer.byteLength(jsonUsers)
	}
 }

 // setup the request
 console.log('sending request: ' + options.host + options.path)
 var request = http.request(options, function (res) {
	res.on('data', function(chunk) {
		console.log(chunk.toString());
	});
 });
 request.write(jsonUsers);

 // complete the request
 request.end()
 
 var jsonPhotos = JSON.stringify([{id: 1, user_id: 1, path: '/steve/photo1', timestamp: 1234}, {id: 7, user_id: 1, path: '/steve/photo2', timestamp: 5678}]);

 var options2 = {
   host: 'localhost',
   port: 3000,
   path: '/bulk/photos?password=zorodi',
   method: 'POST',
   headers: {
        'Content-Type': "application/json; charset=utf-8",
        'Content-Length': Buffer.byteLength(jsonPhotos)
	}
 }

 // setup the request
 console.log('sending request: ' + options2.host + options2.path)
 var request2 = http.request(options2, function (res) {
	res.on('data', function(chunk) {
		console.log(chunk.toString());
	});
 });
 request2.write(jsonPhotos);

 // complete the request
 request2.end()
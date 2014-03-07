  /*
 * GET login page.
 */
var path = require('path');
var fs = require('fs');
var imagemagick = require('imagemagick');
var gm = require('gm').subClass({ imageMagick: true });

exports.load = function(req, res){
	res.writeHead(200, {
            'Content-Type':('image/' + req.params.ext)
	})
	req.models.Photo.get(req.params.id, function(err, photo) {
		var image = gm(photo.Path);
		image.stream(function (err, stdout, stderr)
		{
			stdout.pipe(res); 
		});
	});
}

exports.loadThumbnail = function(req, res){
	res.writeHead(200, {
            'Content-Type':('image/' + req.params.ext)
	})
	req.models.Photo.get(req.params.id, function(err, photo) {
		var image = gm(photo.Path);
		image.resize(400);
		image.stream(function (err, stdout, stderr)
		{
			stdout.pipe(res); 
		});
	});
}

exports.uploadPage = function(req, res, errorMessage){
    res.render('upload', {authenticated: true, error: errorMessage });
}

exports.uploadAction = function(req, res, errorMessage){

  // return to upload page if no image provided
  if ( !req.files.image ){
      error = "File Not Found.";
      exports.uploadPage(req, res, error);    
  }
  else {
    var extension = path.extname(req.files.image.originalFilename).substring(1);
    
    // error if an image was not provided
    if (extension != 'jpg' && extension != 'gif' && extension != 'png' && extension != 'tif'){
      error = "File Not An Image.";
      exports.uploadPage(req, res, error);   
    }
    // valid image provided 
    else {
	
	  // get field values for db
      var userID = parseInt(req.session.user.id);
      var timestamp = new Date().getTime();
	  
	  req.models.Photo.create([
      {
        Path: req.files.image.path,
        owner_id: userID,
        Timestamp: timestamp, 
      }], function (err, items) {
			if (err) 
			{
			error = err.message;
			console.log(error);
			//TODO: Redirect to 404 page
			res.redirect('/feed');
			res.end();
			}
			else
			{
				var newPath = path.normalize(__dirname + "/../photos/" + items[0].id + "." + extension)
				fs.renameSync(req.files.image.path, newPath);
				items[0].Path = newPath;
				items[0].save();
				res.redirect('/feed');
				res.end();
			}
		})



    } 
  }
}
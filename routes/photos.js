  /*
 * GET login page.
 */
var path = require('path');
var fs = require('fs');
var imagemagick = require('imagemagick');
var gm = require('gm').subClass({ imageMagick: true });
var flash = require('connect-flash');

exports.load = function(req, res){
	res.writeHead(200, {
            'Content-Type':('image/' + req.params.ext)
	})
	req.models.Photo.get(req.params.id, function(err, photo) {
		var image = gm(photo.Path);
		image.stream(function (err, stdout, stderr)
		{
			if (err) throw err;
			stdout.pipe(res); 
		});
	});
}

exports.loadThumbnail = function(req, res){
	res.writeHead(200, {
            'Content-Type':('image/' + req.params.ext)
	})
	req.models.Photo.get(req.params.id, function(err, photo) {
		if (err) throw err;
		var image = gm(photo.Path);
		image.resize(400);
		image.stream(function (err, stdout, stderr)
		{
			if (err) throw err;
			stdout.pipe(res); 
		});
	});
}

exports.uploadPage = function(req, res, errorMessage){
	var err = req.flash('NotValidErr')[0];
    res.render('upload', {currentUser: req.session.user, authenticated: true, error: err});
}

exports.uploadAction = function(req, res, errorMessage){
  // return to upload page if no image provided
  if ( req.files.image.size == 0 ){
  	  req.flash('NotValidErr','File Not Found');
      res.redirect('/photos/new');
  }
  else {
    var info = req.files.image.type.split("/");
    var type = info[0];
	var extension = info[1];
	
    // error if an image was not provided
    if (type != 'image'){
      req.flash('NotValidErr', 'File Not an Image');
      res.redirect('/photos/new');
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
			if (err) throw err;
			else
			{
				var newPath = path.normalize(__dirname + "/../photos/" + items[0].id + "." + extension)
				fs.renameSync(req.files.image.path, newPath);
				items[0].Path = newPath;
				items[0].save(function (err) {
					if (err) throw err;
					res.redirect('/feed');
				});
			}
		})



    } 
  }
}
//CREATES A PHOTO JSON OBJECT WHERE EACH USER OWNS {THEIR_USER_ID} PHOTOS
//Useful for testing how the number of images on a stream/feed page affects
//response time
var fs = require('fs')
var counter = 1;

fs.writeFileSync('photos.json', '[');

for (var i = 1; i < 100; i++)
{
	var j = i
	while (j > 0)
	{
		fs.appendFileSync('photos.json', (counter != 1 ? ',': '') + '\n  {\n\t"id": ' + counter + ',\n\t"user_id": ' + i + 
						',\n\t"path": "/home/courses/s513/w2014/pics/' + counter + '.png",\n\t"timestamp": 1395013576314\n  }');
		j--;
 		counter++;
	}

}

fs.appendFileSync('photos.json', '\n]');

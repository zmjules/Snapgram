var index = require("../routes/index")
var assert = require("assert")
describe('index.cleanPhotos', function(){
    it('should return [] when the photo list is empty', function(){
      assert.deepEqual([], index.cleanPhotos([]));
  })
})

photos = [{'id': 2, 'timestamp': 1000}, {'id': 5, 'timestamp': 3000}, {'id': 2, 'timestamp': 3000}]
morePhotos = [{'id': 1, 'timestamp': 1000}, {'id': 2, 'timestamp': 2000}, {'id': 3, 'timestamp': 3000}]
invalidPhotos = [{'id': -1, 'timestamp': 1000}, {'id': 2, 'timestamp': 2000}, {'id': 3.14, 'timestamp': 3000}]

describe('index.cleanPhotos', function(){
	it('should remove duplicate entries to the photo list', function(){
		assert.deepEqual([{'id': 2, 'timestamp': 3000}, {'id': 5, 'timestamp': 3000}], index.cleanPhotos(photos));
	})
})

describe('index.cleanPhotos', function(){
	it('should return all unique entries in the photo list', function(){
		assert.deepEqual([{'id': 3, 'timestamp': 3000}, {'id': 2, 'timestamp': 2000}, {'id': 1, 'timestamp': 1000}], index.cleanPhotos(morePhotos));
	})
})

describe('index.cleanPhotos', function(){
	it('should return all unique (including decimal and negative) entries in the photo list', function(){
		assert.deepEqual([{'id': 3.14, 'timestamp': 3000}, {'id': 2, 'timestamp': 2000}, {'id': -1, 'timestamp': 1000}], index.cleanPhotos(invalidPhotos));
	})
})

var date1 = new Date();

describe('index.time_ago_in_words', function(){
	it('should return a moment ago given times that are the same', function(){
		assert.deepEqual("a moment ago", index.time_ago_in_words(date1));
	})
})

var date2 = new Date();
date2.setMonth(date2.getMonth() - 1);

describe('index.time_ago_in_words', function(){
	it('should return a month ago given appropriate times', function(){
		assert.deepEqual("1 month ago", index.time_ago_in_words(date2));
	}) 
})  

var date3 = new Date();
date3.setFullYear(date3.getFullYear() - 1);

describe('index.time_ago_in_words', function(){
	it('should return a year ago given appropriate times', function(){
		assert.deepEqual("1 year ago", index.time_ago_in_words(date3));
	}) 
}) 

var date4 = new Date();
date4.setMonth(date4.getMonth() - 1);

describe('index.time_ago_in_words', function(){
	it('should return a month ago given appropriate times', function(){
		assert.deepEqual("1 month ago", index.time_ago_in_words(date4));
	}) 
}) 

var date5 = new Date();
date5.setMinutes(date4.getMinutes() - 50);

describe('index.time_ago_in_words', function(){
	it('should return 50 minutes ago given appropriate times', function(){
		assert.deepEqual("50 minutes ago", index.time_ago_in_words(date5));
	}) 
}) 


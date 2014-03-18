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






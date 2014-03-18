var index = require("../routes/index")
var assert = require("assert")
describe('index.cleanPhotos', function(){
    it('should return [] when the photo list is empty', function(){
      assert.deepEqual([], index.cleanPhotos([]));
  })
})

photos = [{'id': 2, 'timestamp': 1000}, {'id': 5, 'timestamp': 3000}, {'id': 2, 'timestamp': 3000}]

describe('index.cleanPhotos', function(){
    it('should return [] when the photo list is empty', function(){
      assert.deepEqual([{'id': 2, 'timestamp': 3000}, {'id': 5, 'timestamp': 3000}], index.cleanPhotos(photos));
  })
})
var index = require("../routes/index")
var assert = require("assert")
describe('index.cleanPhotos', function(){
    it('should return [] when the photo list is empty', function(){
      assert.deepEqual([], index.cleanPhotos([]));
  })
})

photos = [{'ID': 2, 'timestamp': 1000}, {'ID': 5, 'timestamp': 3000}, {'ID': 2, 'timestamp': 3000}]

describe('index.cleanPhotos', function(){
    it('should return [] when the photo list is empty', function(){
      assert.equal([{'ID': 2, 'timestamp': 1000}, {'ID': 5, 'timestamp': 3000}], index.cleanPhotos(photos));
  })
})
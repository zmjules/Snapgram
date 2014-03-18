var login = require("../routes/login")
var assert = require("assert")
describe('login.loginAction', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, login.loginAction(10));
  })
})


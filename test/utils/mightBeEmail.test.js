var should = require('should');

var mightBeEmail = require('../../src/utils/mightBeEmail');

describe('mightBeEmail()', function () {
  it('should return `true` for possible emails', function () {
    mightBeEmail('email@example.com').should.eql(true);
    mightBeEmail('hey.ho@letsgo.com').should.eql(true);
    mightBeEmail('abc@xyz.com.uk').should.eql(true);
  });

  it('should return `false` for non-emails', function () {
    mightBeEmail('John Doe').should.eql(false);
    mightBeEmail('123456789').should.eql(false);
    mightBeEmail('foo').should.eql(false);
    mightBeEmail('The quick brown fox jumps over the lazy dog.').should.eql(false);
  });
});

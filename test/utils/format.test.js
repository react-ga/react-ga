var should = require('should');
var sinon = require('sinon');

var format = require('../../src/utils/format');

describe('format()', function () {
  it('should not format email addresses', function () {
    sinon.stub(console, 'warn');
    console.warn.callCount.should.equal(0);
    format('hi@example.com').should.eql('REDACTED (Potential Email Address)');
    console.warn.callCount.should.equal(1);
    format('hey.ho@letsgo.com').should.eql('REDACTED (Potential Email Address)');
    console.warn.callCount.should.equal(2);
    format('abc@xyz.com.uk').should.eql('REDACTED (Potential Email Address)');
    console.warn.callCount.should.equal(3);
    console.warn.restore();
  });

  it('should format non-email addresses', function () {
    format('mystring').should.eql('Mystring');
    format('foo bar').should.eql('Foo Bar');
    format('foo_bar').should.eql('Foo_bar');
    format('foo.bar').should.eql('foo.bar');
    format('FOO_BAR').should.eql('FOO_BAR');
    format('123456789').should.eql('123456789');
    format('the quick brown fox').should.eql('The Quick Brown Fox');
  });
});

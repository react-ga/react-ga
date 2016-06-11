var should = require('should');
var sinon = require('sinon');

var format = require('../../src/utils/format');

describe('format()', function () {
  it('should not format email addresses', function () {
    sinon.stub(console, 'warn');
    console.warn.callCount.should.eql(0);
    format('hi@example.com').should.eql('REDACTED (Potential Email Address)');
    console.warn.callCount.should.eql(1);
    format('hey.ho@letsgo.com').should.eql('REDACTED (Potential Email Address)');
    console.warn.callCount.should.eql(2);
    format('abc@xyz.com.uk').should.eql('REDACTED (Potential Email Address)');
    console.warn.callCount.should.eql(3);
    console.warn.restore();
  });

  it('should format non-email addresses', function () {
    format('mystring').should.eql('mystring');
    format('mystring', true).should.eql('Mystring');
    format('foo bar').should.eql('foo bar');
    format('foo bar', true).should.eql('Foo Bar');
    format('foo_bar').should.eql('foo_bar');
    format('foo_bar', true).should.eql('Foo_bar');
    format('foo.bar').should.eql('foo.bar');
    format('foo.bar', true).should.eql('foo.bar');
    format('FOO_BAR').should.eql('FOO_BAR');
    format('FOO_BAR', true).should.eql('FOO_BAR');
    format('123456789').should.eql('123456789');
    format('123456789', true).should.eql('123456789');
    format('the quick brown fox').should.eql('the quick brown fox');
    format('the quick brown fox', true).should.eql('The Quick Brown Fox');
  });
});

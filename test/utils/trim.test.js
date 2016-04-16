var should = require('should');

var trim = require('../../src/utils/trim');

describe('trim()', function () {
  it('should trim a string with leading whitespaces', function () {
    trim('   foobar').should.eql('foobar');
    trim('\n\nfoobar').should.eql('foobar');
    trim('\t\tfoobar').should.eql('foobar');
    trim('\r\rfoobar').should.eql('foobar');
    trim('\r\n\t foobar').should.eql('foobar');
  });

  it('should trim a string with trailing whitespaces', function () {
    trim('foobar  ').should.eql('foobar');
    trim('foobar\n\n').should.eql('foobar');
    trim('foobar\t\t').should.eql('foobar');
    trim('foobar\r\r').should.eql('foobar');
    trim('foobar\r\n\t  ').should.eql('foobar');
  });

  it('should trim a string with leading and trailing whitespaces', function () {
    trim('     foobar  ').should.eql('foobar');
    trim('\n\nfoobar\n\n').should.eql('foobar');
    trim('\t\tfoobar\t\t').should.eql('foobar');
    trim('\r\rfoobar\r\r').should.eql('foobar');
    trim('\r\n\t  foobar\r\n\t  ').should.eql('foobar');
  });

  it('should trim a sentence with leading and/or trailing whitespaces', function () {
    trim('The quick brown fox.').should.eql('The quick brown fox.');
    trim(' The quick brown fox. ').should.eql('The quick brown fox.');
    trim('\t\tThe quick brown fox.\t\t').should.eql('The quick brown fox.');
    trim('\r\rThe quick brown fox.\r\r').should.eql('The quick brown fox.');
    trim('\r\n\t  The quick brown fox.\r\n\t  ').should.eql('The quick brown fox.');
  });
});

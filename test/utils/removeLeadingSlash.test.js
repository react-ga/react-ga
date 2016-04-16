var should = require('should');

var removeLeadingSlash = require('../../src/utils/removeLeadingSlash');

describe('removeLeadingSlash()', function () {
  it('should remove leading slashes', function () {
    removeLeadingSlash('/mymodal').should.eql('mymodal');
    removeLeadingSlash('/mymodal/is/awesome').should.eql('mymodal/is/awesome');
  });

  it('should not modify the string if there is no leading slash', function () {
    removeLeadingSlash('mymodal').should.eql('mymodal');
    removeLeadingSlash('mymodal/is/awesome').should.eql('mymodal/is/awesome');
  });
});

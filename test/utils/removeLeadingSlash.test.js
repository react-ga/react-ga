import should from 'should';

import removeLeadingSlash from '../../src/utils/removeLeadingSlash';

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

import removeLeadingSlash from '../../src/utils/removeLeadingSlash';

describe('removeLeadingSlash()', () => {
  it('should remove leading slashes', () => {
    expect(removeLeadingSlash('/mymodal')).toEqual('mymodal');
    expect(removeLeadingSlash('/mymodal/is/awesome')).toEqual(
      'mymodal/is/awesome'
    );
  });

  it('should not modify the string if there is no leading slash', () => {
    expect(removeLeadingSlash('mymodal')).toEqual('mymodal');
    expect(removeLeadingSlash('mymodal/is/awesome')).toEqual(
      'mymodal/is/awesome'
    );
  });
});

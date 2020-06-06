import trim from '../../src/utils/trim';

describe('trim()', () => {
  it('should trim a string with leading whitespaces', () => {
    expect(trim('   foobar')).toEqual('foobar');
    expect(trim('\n\nfoobar')).toEqual('foobar');
    expect(trim('\t\tfoobar')).toEqual('foobar');
    expect(trim('\r\rfoobar')).toEqual('foobar');
    expect(trim('\r\n\t foobar')).toEqual('foobar');
  });

  it('should trim a string with trailing whitespaces', () => {
    expect(trim('foobar  ')).toEqual('foobar');
    expect(trim('foobar\n\n')).toEqual('foobar');
    expect(trim('foobar\t\t')).toEqual('foobar');
    expect(trim('foobar\r\r')).toEqual('foobar');
    expect(trim('foobar\r\n\t  ')).toEqual('foobar');
  });

  it('should trim a string with leading and trailing whitespaces', () => {
    expect(trim('     foobar  ')).toEqual('foobar');
    expect(trim('\n\nfoobar\n\n')).toEqual('foobar');
    expect(trim('\t\tfoobar\t\t')).toEqual('foobar');
    expect(trim('\r\rfoobar\r\r')).toEqual('foobar');
    expect(trim('\r\n\t  foobar\r\n\t  ')).toEqual('foobar');
  });

  it('should trim a sentence with leading and/or trailing whitespaces', () => {
    expect(trim('The quick brown fox.')).toEqual('The quick brown fox.');
    expect(trim(' The quick brown fox. ')).toEqual('The quick brown fox.');
    expect(trim('\t\tThe quick brown fox.\t\t')).toEqual(
      'The quick brown fox.'
    );
    expect(trim('\r\rThe quick brown fox.\r\r')).toEqual(
      'The quick brown fox.'
    );
    expect(trim('\r\n\t  The quick brown fox.\r\n\t  ')).toEqual(
      'The quick brown fox.'
    );
  });
});

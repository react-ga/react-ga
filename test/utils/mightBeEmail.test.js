import mightBeEmail from '../../src/utils/mightBeEmail';

describe('mightBeEmail()', () => {
  it('should return `true` for possible emails', () => {
    expect(mightBeEmail('email@example.com')).toEqual(true);
    expect(mightBeEmail('hey.ho@letsgo.com')).toEqual(true);
    expect(mightBeEmail('abc@xyz.com.uk')).toEqual(true);
  });

  it('should return `false` for non-emails', () => {
    expect(mightBeEmail('John Doe')).toEqual(false);
    expect(mightBeEmail('123456789')).toEqual(false);
    expect(mightBeEmail('foo')).toEqual(false);
    expect(
      mightBeEmail('The quick brown fox jumps over the lazy dog.')
    ).toEqual(false);
  });
});

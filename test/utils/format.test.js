import format from '../../src/utils/format';

describe('format()', () => {
  it('should not format when redactingEmail is false', () => {
    const titleCase = false;
    const redactingEmail = false;
    expect(format('hi@example.com', titleCase, redactingEmail)).toEqual(
      'hi@example.com'
    );
    expect(format('hey.ho@letsgo.com', titleCase, redactingEmail)).toEqual(
      'hey.ho@letsgo.com'
    );
    expect(format('abc@xyz.com.uk', titleCase, redactingEmail)).toEqual(
      'abc@xyz.com.uk'
    );
  });

  it('should not format email addresses', () => {
    const warnSpy = jest
      .spyOn(global.console, 'warn')
      .mockImplementation(() => {});
    expect(warnSpy).toHaveBeenCalledTimes(0);
    expect(format('hi@example.com')).toEqual(
      'REDACTED (Potential Email Address)'
    );
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(format('hey.ho@letsgo.com')).toEqual(
      'REDACTED (Potential Email Address)'
    );
    expect(warnSpy).toHaveBeenCalledTimes(2);
    expect(format('abc@xyz.com.uk')).toEqual(
      'REDACTED (Potential Email Address)'
    );
    expect(warnSpy).toHaveBeenCalledTimes(3);
    jest.restoreAllMocks();
  });

  it('should format non-email addresses', () => {
    expect(format('mystring')).toEqual('mystring');
    expect(format('mystring', true)).toEqual('Mystring');
    expect(format('foo bar')).toEqual('foo bar');
    expect(format('foo bar', true)).toEqual('Foo Bar');
    expect(format('foo_bar')).toEqual('foo_bar');
    expect(format('foo_bar', true)).toEqual('Foo_bar');
    expect(format('foo.bar')).toEqual('foo.bar');
    expect(format('foo.bar', true)).toEqual('foo.bar');
    expect(format('FOO_BAR')).toEqual('FOO_BAR');
    expect(format('FOO_BAR', true)).toEqual('FOO_BAR');
    expect(format('123456789')).toEqual('123456789');
    expect(format('123456789', true)).toEqual('123456789');
    expect(format('the quick brown fox')).toEqual('the quick brown fox');
    expect(format('the quick brown fox', true)).toEqual('The Quick Brown Fox');
  });
});

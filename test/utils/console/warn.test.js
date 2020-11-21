import warn from '../../../src/utils/console/warn';

describe('warn()', () => {
  it('should append [react-ga] to warning messages', () => {
    const warnSpy = jest
      .spyOn(global.console, 'warn')
      .mockImplementation(() => {});
    expect(warnSpy).toHaveBeenCalledTimes(0);
    warn('foo bar');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith('[react-ga]', 'foo bar');
    jest.restoreAllMocks();
  });
});

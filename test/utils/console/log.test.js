import log from '../../../src/utils/console/log';

describe('log()', () => {
  it('should append [react-ga] to log messages', () => {
    const logSpy = jest
      .spyOn(global.console, 'info')
      .mockImplementation(() => {});
    expect(logSpy).toHaveBeenCalledTimes(0);
    log('foo bar');
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith('[react-ga]', 'foo bar');
    jest.restoreAllMocks();
  });
});

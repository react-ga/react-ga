import * as ReactGA from '../../src';

jest.mock('../../src/utils/loadGA');

describe('exception()', () => {
  const spies = {};

  beforeEach(() => {
    spies.warn = jest
      .spyOn(global.console, 'warn')
      .mockImplementation(() => {});
    spies.info = jest
      .spyOn(global.console, 'info')
      .mockImplementation(() => {});
    spies.ga = jest.fn();
    global.window.ga = spies.ga;
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should record an exception', () => {
    ReactGA.initialize('foo');
    ReactGA.exception({});
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      hitType: 'exception'
    });
  });

  it('should record a description value', () => {
    ReactGA.initialize('foo');
    ReactGA.exception({ description: 'This is an exception!' });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      exDescription: 'This Is an Exception!',
      hitType: 'exception'
    });
  });

  it('should record a fatal value', () => {
    ReactGA.initialize('foo');
    ReactGA.exception({ fatal: true });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      exFatal: true,
      hitType: 'exception'
    });
  });

  it('should reject a non-boolean fatal value', () => {
    ReactGA.initialize('foo');
    ReactGA.exception({ fatal: 'this-is-fatal' });
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      '`args.fatal` must be a boolean.'
    );
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      hitType: 'exception'
    });
  });
});

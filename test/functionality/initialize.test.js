import * as ReactGA from '../../src';

jest.mock('../../src/utils/loadGA');

describe('initialize()', () => {
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

  it('should define window.ga', () => {
    ReactGA.initialize('foo');
    expect(typeof window.ga).toBe('function');
  });

  it('should call window.ga() if no options given', () => {
    ReactGA.initialize('foo');
    expect(spies.ga).toHaveBeenCalledTimes(1);
    expect(spies.ga).toHaveBeenCalledWith('create', 'foo', 'auto');
  });

  it('should call window.ga() with ga options if they are given', () => {
    ReactGA.initialize('foo', { gaOptions: { userId: 123 } });
    expect(spies.ga).toHaveBeenCalledTimes(1);
    expect(spies.ga).toHaveBeenCalledWith('create', 'foo', { userId: 123 });
  });

  it('should not call window.ga() if options.useExistingGa is set', () => {
    ReactGA.initialize('foo', { useExistingGa: true });
    expect(spies.ga).toHaveBeenCalledTimes(0);
  });

  it('should initialize multiple trackers if they are given', () => {
    ReactGA.initialize([
      { trackingId: 'foo', gaOptions: { userId: 123 } },
      { trackingId: 'bar', gaOptions: { name: 'baz' } }
    ]);
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', {
      userId: 123
    });
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'create', 'bar', {
      name: 'baz'
    });
  });

  it('should error if initialize multiple trackers are missing trackingId', () => {
    ReactGA.initialize([{ gaOptions: { userId: 123 } }]);
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'gaTrackingID is required in initialize()'
    );
    expect(spies.ga).toHaveBeenCalledTimes(0);
  });

  it('should abort, log warning if tracking ID is not given', () => {
    ReactGA.initialize();
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'gaTrackingID is required in initialize()'
    );
    expect(spies.ga).toHaveBeenCalledTimes(0);
  });
});

import * as ReactGA from '../../src';

jest.mock('../../src/utils/loadGA');

describe('pageview()', () => {
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

  it('should output debug info, if debug is on', () => {
    const options = { debug: true };
    ReactGA.initialize('foo', options);
    ReactGA.pageview('/valid');
    expect(spies.info).toHaveBeenCalledTimes(2);
    expect(spies.info).toHaveBeenNthCalledWith(
      1,
      '[react-ga]',
      "called ga('send', 'pageview', path);"
    );
    expect(spies.info).toHaveBeenNthCalledWith(
      2,
      '[react-ga]',
      'with path: /valid'
    );
  });

  it('should record a pageview', () => {
    ReactGA.initialize('foo');
    ReactGA.pageview('/valid');
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      hitType: 'pageview',
      page: '/valid'
    });
  });

  it('should pass an optional title', () => {
    ReactGA.initialize('foo');
    ReactGA.pageview('/valid', null, 'Title');
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      hitType: 'pageview',
      page: '/valid',
      title: 'Title'
    });
  });

  it('should record a pageview with multiple trackers', () => {
    ReactGA.initialize([
      { trackingId: 'foo' },
      { trackingId: 'bar', gaOptions: { name: 'baz' } }
    ]);
    ReactGA.pageview('/valid', ['baz']);
    expect(spies.ga).toHaveBeenCalledTimes(4);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'create', 'bar', {
      name: 'baz'
    });
    expect(spies.ga).toHaveBeenNthCalledWith(3, 'send', {
      hitType: 'pageview',
      page: '/valid'
    });
    expect(spies.ga).toHaveBeenNthCalledWith(4, 'baz.send', {
      hitType: 'pageview',
      page: '/valid'
    });
  });

  it('should record a pageview with multiple trackers, except default', () => {
    ReactGA.initialize(
      [
        { trackingId: 'foo' },
        { trackingId: 'bar', gaOptions: { name: 'baz' } }
      ],
      { alwaysSendToDefaultTracker: false }
    );
    ReactGA.pageview('/valid', ['baz']);
    expect(spies.ga).toHaveBeenCalledTimes(3);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'create', 'bar', {
      name: 'baz'
    });
    expect(spies.ga).toHaveBeenNthCalledWith(3, 'baz.send', {
      hitType: 'pageview',
      page: '/valid'
    });
  });

  it('should abort, log warning if path is not provided', () => {
    ReactGA.initialize('foo');
    ReactGA.pageview();
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'path is required in .pageview()'
    );
  });

  it('should abort, log warning if path is empty string', () => {
    ReactGA.initialize('foo');
    ReactGA.pageview('');
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'path is required in .pageview()'
    );
  });

  it('should abort, log warning if path is empty string of spaces', () => {
    ReactGA.initialize('foo');
    ReactGA.pageview('  ');
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'path cannot be an empty string in .pageview()'
    );
  });
});

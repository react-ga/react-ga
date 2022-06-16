import * as ReactGA from '../../src';

jest.mock('../../src/utils/loadGA');

describe('send()', () => {
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

  it('should record a pageview using send', () => {
    ReactGA.initialize('foo');
    ReactGA.send({
      hitType: 'pageview',
      page: '/valid'
    });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      hitType: 'pageview',
      page: '/valid'
    });
  });

  it('should record an event using send', () => {
    ReactGA.initialize('foo');
    ReactGA.send({
      hitType: 'event',
      eventCategory: 'category',
      eventAction: 'action'
    });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      hitType: 'event',
      eventCategory: 'category',
      eventAction: 'action'
    });
  });

  it('should send to multiple trackers', () => {
    ReactGA.initialize([
      { trackingId: 'foo', gaOptions: { userId: 123 } },
      { trackingId: 'bar', gaOptions: { name: 'baz' } }
    ]);
    ReactGA.send(
      {
        hitType: 'event',
        eventCategory: 'category',
        eventAction: 'action'
      },
      ['baz']
    );
    expect(spies.ga).toHaveBeenCalledTimes(4);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', {
      userId: 123
    });
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'create', 'bar', {
      name: 'baz'
    });
    expect(spies.ga).toHaveBeenNthCalledWith(3, 'send', {
      hitType: 'event',
      eventCategory: 'category',
      eventAction: 'action'
    });
    expect(spies.ga).toHaveBeenNthCalledWith(4, 'baz.send', {
      hitType: 'event',
      eventCategory: 'category',
      eventAction: 'action'
    });
  });

  it('should send to default', () => {
    ReactGA.initialize(
      [
        { trackingId: 'foo', gaOptions: { userId: 123 } },
        { trackingId: 'bar', gaOptions: { name: 'baz' } }
      ],
      { alwaysSendToDefaultTracker: false }
    );
    ReactGA.send(
      {
        hitType: 'event',
        eventCategory: 'category',
        eventAction: 'action'
      },
      ['baz']
    );
    expect(spies.ga).toHaveBeenCalledTimes(3);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', {
      userId: 123
    });
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'create', 'bar', {
      name: 'baz'
    });
    expect(spies.ga).toHaveBeenNthCalledWith(3, 'baz.send', {
      hitType: 'event',
      eventCategory: 'category',
      eventAction: 'action'
    });
  });

  it('should ignore the alwaysSendToDefaultTracker flag when no trackerNames are specified', () => {
    ReactGA.initialize(
      [
        { trackingId: 'foo', gaOptions: { userId: 123 } },
        { trackingId: 'bar', gaOptions: { name: 'baz' } }
      ],
      { alwaysSendToDefaultTracker: false }
    );
    ReactGA.send({
      hitType: 'event',
      eventCategory: 'category',
      eventAction: 'action'
    });
    expect(spies.ga).toHaveBeenCalledTimes(3);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', {
      userId: 123
    });
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'create', 'bar', {
      name: 'baz'
    });
    expect(spies.ga).toHaveBeenNthCalledWith(3, 'send', {
      hitType: 'event',
      eventCategory: 'category',
      eventAction: 'action'
    });
  });
});

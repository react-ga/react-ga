import * as ReactGA from '../../src';

jest.mock('../../src/utils/loadGA');

describe('event()', () => {
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

  it('should record an event', () => {
    ReactGA.initialize('foo');
    ReactGA.event({ category: 'Test', action: 'Send Test' });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      hitType: 'event'
    });
  });

  it('should record an event with multiple trackers', () => {
    ReactGA.initialize([
      { trackingId: 'foo' },
      { trackingId: 'bar', gaOptions: { name: 'baz' } }
    ]);
    ReactGA.event({ category: 'Test', action: 'Send Test' }, ['baz']);
    expect(spies.ga).toHaveBeenCalledTimes(4);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'create', 'bar', {
      name: 'baz'
    });
    expect(spies.ga).toHaveBeenNthCalledWith(3, 'send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      hitType: 'event'
    });
    expect(spies.ga).toHaveBeenNthCalledWith(4, 'baz.send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      hitType: 'event'
    });
  });

  it('should record an event with strings converted to titleCase', () => {
    ReactGA.initialize('foo');
    ReactGA.event({ category: 'test', action: 'send test' });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      hitType: 'event'
    });
  });

  it('should not convert strings to titleCase if the flag is false', () => {
    ReactGA.initialize('foo', { titleCase: false });
    ReactGA.event({ category: 'test', action: 'send test' });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'send test',
      eventCategory: 'test',
      hitType: 'event'
    });
  });

  it('should warn if args object is missing', () => {
    ReactGA.initialize('foo');
    ReactGA.event();
    expect(spies.warn).toHaveBeenCalledTimes(1);
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.category AND args.action are required in event()'
    );
  });

  it('should warn if category is missing', () => {
    ReactGA.initialize('foo');
    ReactGA.event({ action: 'Send Test' });
    expect(spies.warn).toHaveBeenCalledTimes(1);
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.category AND args.action are required in event()'
    );
  });

  it('should warn if category is empty string', () => {
    ReactGA.initialize('foo');
    ReactGA.event({ category: '', action: 'Send Test' });
    expect(spies.warn).toHaveBeenCalledTimes(1);
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.category AND args.action are required in event()'
    );
  });

  it('should warn if action is missing', () => {
    ReactGA.initialize('foo');
    ReactGA.event({ category: 'Test' });
    expect(spies.warn).toHaveBeenCalledTimes(1);
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.category AND args.action are required in event()'
    );
  });

  it('should warn if action is empty string', () => {
    ReactGA.initialize('foo');
    ReactGA.event({ category: 'Test', action: '' });
    expect(spies.warn).toHaveBeenCalledTimes(1);
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.category AND args.action are required in event()'
    );
  });

  it('should record a label value', () => {
    ReactGA.initialize('foo');
    ReactGA.event({
      category: 'Test',
      action: 'Send Test',
      label: 'Test Label Value'
    });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      eventLabel: 'Test Label Value',
      hitType: 'event'
    });
  });

  it('should record a value', () => {
    ReactGA.initialize('foo');
    ReactGA.event({ category: 'Test', action: 'Send Test', value: 10 });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      eventValue: 10,
      hitType: 'event'
    });
  });

  it('should record a value of zero', () => {
    ReactGA.initialize('foo');
    ReactGA.event({ category: 'Test', action: 'Send Test', value: 0 });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      eventValue: 0,
      hitType: 'event'
    });
  });

  it('should reject a non-numeric value value', () => {
    ReactGA.initialize('foo');
    ReactGA.event({
      category: 'Test',
      action: 'Send Test',
      value: 'millions'
    });
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'Expected `args.value` arg to be a Number.'
    );
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      hitType: 'event'
    });
  });

  it('should record a nonInteraction value', () => {
    ReactGA.initialize('foo');
    ReactGA.event({
      category: 'Test',
      action: 'Send Test',
      nonInteraction: true
    });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      nonInteraction: true,
      hitType: 'event'
    });
  });

  it('should reject a non-boolean nonInteraction value', () => {
    ReactGA.initialize('foo');
    ReactGA.event({
      category: 'Test',
      action: 'Send Test',
      nonInteraction: 'yeahsure'
    });
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      '`args.nonInteraction` must be a boolean.'
    );
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      hitType: 'event'
    });
  });

  it('should record a valid transport value', () => {
    ReactGA.initialize('foo');
    ReactGA.event({
      category: 'Test',
      action: 'Send Test',
      transport: 'beacon'
    });
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      transport: 'beacon',
      hitType: 'event'
    });
  });

  it('should reject a non-string transport value', () => {
    ReactGA.initialize('foo');
    ReactGA.event({ category: 'Test', action: 'Send Test', transport: true });
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      '`args.transport` must be a string.'
    );
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      hitType: 'event'
    });
  });

  it('should warn but allow an invalid transport value string', () => {
    ReactGA.initialize('foo');
    ReactGA.event({
      category: 'Test',
      action: 'Send Test',
      transport: 'lolwut'
    });
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      '`args.transport` must be either one of these values: ' +
        '`beacon`, `xhr` or `image`'
    );
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      transport: 'lolwut',
      hitType: 'event'
    });
  });

  it('should send custom dimensions with the event payload', () => {
    ReactGA.initialize('foo');
    ReactGA.event({
      category: 'Test',
      action: 'Send Test',
      dimension1: 'foo',
      dimension20: 'bar'
    });

    expect(spies.ga).toHaveBeenCalledWith('send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      hitType: 'event',
      dimension1: 'foo',
      dimension20: 'bar'
    });
  });

  it('should send custom metrics with the event payload', () => {
    ReactGA.initialize('foo');
    ReactGA.event({
      category: 'Test',
      action: 'Send Test',
      metric1: 1,
      metric20: 2.6
    });

    expect(spies.ga).toHaveBeenCalledWith('send', {
      eventAction: 'Send Test',
      eventCategory: 'Test',
      hitType: 'event',
      metric1: 1,
      metric20: 2.6
    });
  });
});

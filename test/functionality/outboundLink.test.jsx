import React from 'react';
import { mount } from 'enzyme';
import * as ReactGA from '../../src';

jest.mock('../../src/utils/loadGA');

describe('outboundLink()', () => {
  const spies = {};

  beforeEach(() => {
    spies.warn = jest
      .spyOn(global.console, 'warn')
      .mockImplementation(() => {});
    spies.info = jest
      .spyOn(global.console, 'info')
      .mockImplementation(() => {});
    spies.error = jest
      .spyOn(global.console, 'info')
      .mockImplementation(() => {});
    spies.ga = jest.fn();
    global.window.ga = spies.ga;
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should record an outboundLink event', () => {
    ReactGA.initialize('foo');
    ReactGA.outboundLink({ label: 'Test Click' }, () => {});

    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', {
      eventAction: 'Click',
      eventCategory: 'Outbound',
      eventLabel: 'Test Click',
      hitCallback: expect.anything(),
      hitType: 'event'
    });
  });

  it('should warn if all args are missing', () => {
    ReactGA.initialize('foo');
    ReactGA.outboundLink();
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'hitCallback function is required'
    );
  });

  it('should warn if label arg is missing', () => {
    ReactGA.initialize('foo');
    ReactGA.outboundLink({ missing: 'labelarg' }, () => {
      // do nothing on callback
    });

    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'args.label is required in outboundLink()'
    );
  });

  it('should warn if hitCallback is missing', () => {
    ReactGA.initialize('foo');
    ReactGA.outboundLink({ label: 'Missing hitCallback' });
    expect(spies.warn).toHaveBeenCalledWith(
      '[react-ga]',
      'hitCallback function is required'
    );
  });

  it('should fire hitCallback if ga is defined', () => {
    jest.useFakeTimers();
    const callBackFn = jest.fn();
    ReactGA.initialize('foo');
    ReactGA.outboundLink({ label: 'http://www.google.com' }, callBackFn);
    jest.runAllTimers();
    expect(callBackFn).toHaveBeenCalled();
    jest.clearAllTimers();
  });

  it('should fire hitCallback if ga is not defined', () => {
    jest.useFakeTimers();
    const callBackFn = jest.fn();
    ReactGA.outboundLink({ label: 'http://www.google.com' }, callBackFn);
    jest.runAllTimers();
    expect(callBackFn).toHaveBeenCalled();
    jest.clearAllTimers();
  });

  it('should fire hitCallback if ga is available and responds in under 250ms', () => {
    // use fake timers to simulate response time from GA
    jest.useFakeTimers();

    const gaCallback = jest.fn();
    ReactGA.initialize('foo');
    ReactGA.outboundLink({ label: 'http://www.google.com' }, gaCallback);

    jest.advanceTimersByTime(125);
    const functionCalledBack = spies.ga.mock.calls[1][1].hitCallback;
    functionCalledBack();
    expect(gaCallback).toHaveBeenCalledTimes(1);
    jest.clearAllTimers();
  });

  it('should not fire hitCallback twice if ga responds after 250ms', () => {
    // use fake timers to simulate response time from GA
    jest.useFakeTimers();
    const gaCallback = jest.fn();

    ReactGA.initialize('foo');

    ReactGA.outboundLink({ label: 'http://www.google.com' }, gaCallback);

    jest.advanceTimersByTime(260);
    const functionCalledBack = spies.ga.mock.calls[1][1].hitCallback;
    functionCalledBack();
    expect(gaCallback).toHaveBeenCalledTimes(1);
    jest.clearAllTimers();
  });

  it('should fire hitCallback if ga is not available after 250ms', () => {
    jest.useFakeTimers();
    ReactGA.initialize('foo');
    const gaCallback = jest.fn();

    ReactGA.outboundLink({ label: 'http://www.google.com' }, gaCallback);

    const simulatedResponseTime = 275;
    jest.advanceTimersByTime(simulatedResponseTime);
    expect(gaCallback).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});

/**
 * OutboundLink()
 */

describe('OutboundLink()', () => {
  it('should create a React component <OutboundLink>', () => {
    global.window.ga = jest.fn();
    ReactGA.initialize('track-id');

    const OutboundLinkComponent = ReactGA.OutboundLink;
    expect(
      mount(<OutboundLinkComponent eventLabel="some-label" />).html()
    ).toMatchInlineSnapshot('"<a></a>"');
  });
});

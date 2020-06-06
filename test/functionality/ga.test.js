import * as ReactGA from '../../src';

jest.mock('../../src/utils/loadGA');

describe('ga()', () => {
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

  it('should return the same object as window.ga when no arguments are passed', () => {
    ReactGA.initialize('foo');
    expect(ReactGA.ga()).toEqual(window.ga);
  });

  it('should send the correct arguments to window.ga when arguments are passed', () => {
    ReactGA.initialize('foo');
    ReactGA.ga('send', 'pageview', '/mypage');
    expect(spies.ga).toHaveBeenCalledTimes(2);
    expect(spies.ga).toHaveBeenNthCalledWith(1, 'create', 'foo', 'auto');
    expect(spies.ga).toHaveBeenNthCalledWith(2, 'send', 'pageview', '/mypage');
  });

  it('should output debug info, if debug is on', () => {
    ReactGA.initialize('foo', { debug: true });
    ReactGA.ga('send', 'pageview', '/mypage');
    expect(spies.info).toHaveBeenCalledTimes(2);
    expect(spies.info).toHaveBeenNthCalledWith(
      1,
      '[react-ga]',
      "called ga('arguments');"
    );
    expect(spies.info).toHaveBeenNthCalledWith(
      2,
      '[react-ga]',
      'with arguments: ["send","pageview","/mypage"]'
    );
  });
});

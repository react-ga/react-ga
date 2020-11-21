import * as ReactGA from '../../src/index';

describe('test mode', () => {
  it('should send the correct arguments to window.ga when arguments are passed', () => {
    ReactGA.initialize('foo', { testMode: true });
    ReactGA.ga('send', 'pageview', '/mypage');
    expect(ReactGA.testModeAPI.calls).toStrictEqual([
      ['create', 'foo', 'auto'],
      ['send', 'pageview', '/mypage']
    ]);
  });
});

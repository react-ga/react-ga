import * as ReactGA from '../../src/index';

describe('test mode', function () {
  it('should send the correct arguments to window.ga when arguments are passed', function () {
    ReactGA.initialize('foo', { testMode: true });
    ReactGA.ga('send', 'pageview', '/mypage');
    ReactGA.testModeAPI.calls.should.eql([
      ['create', 'foo', 'auto'],
      ['send', 'pageview', '/mypage']
    ]);
  });
});

import * as ReactGA from '../../src';

export default function gaTests(spies) {
  describe('ga()', function () {
    it('should return the same object as window.ga when no arguments are passed', function () {
      ReactGA.initialize('foo');
      (ReactGA.ga() === window.ga).should.eql(true);
    });

    it('should send the correct arguments to window.ga when arguments are passed', function () {
      ReactGA.initialize('foo');
      ReactGA.ga('send', 'pageview', '/mypage');
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', 'pageview', '/mypage']
      ]);
    });

    it('should output debug info, if debug is on', function () {
      ReactGA.initialize('foo', { debug: true });
      ReactGA.ga('send', 'pageview', '/mypage');
      spies.info.args.should.eql([
        ["called ga('arguments');"],
        ['with arguments: ["send","pageview","/mypage"]']
      ]);
    });
  });
}

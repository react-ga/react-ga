import * as ReactGA from '../../src';

export default function modalviewTests(spies) {
  describe('modalview()', function () {
    it('should output debug info, if debug is on', function () {
      const options = { debug: true };
      ReactGA.initialize('foo', options);
      ReactGA.modalview('valid');
      spies.info.args.should.eql([
        ["called ga('send', 'pageview', path);"],
        ['with path: /modal/valid']
      ]);
    });

    it('should record a modalview', function () {
      ReactGA.initialize('foo');
      ReactGA.modalview('valid');
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', 'pageview', '/modal/valid']
      ]);
    });

    it('should remove a leading slash', function () {
      ReactGA.initialize('foo');
      ReactGA.modalview('/valid');
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', 'pageview', '/modal/valid']
      ]);
    });

    it('should abort, log warning if modalName is not provided', function () {
      ReactGA.initialize('foo');
      ReactGA.modalview();
      spies.warn.args.should.eql([
        ['modalName is required in .modalview(modalName)']
      ]);
    });

    it('should abort, log warning if modalName is empty string', function () {
      ReactGA.initialize('foo');
      ReactGA.modalview('');
      spies.warn.args.should.eql([
        ['modalName is required in .modalview(modalName)']
      ]);
    });

    it('should abort, log warning if modalName is empty string of spaces', function () {
      ReactGA.initialize('foo');
      ReactGA.modalview('  ');
      spies.warn.args.should.eql([
        ['modalName cannot be an empty string or a single / in .modalview()']
      ]);
    });

    it('should abort, log warning if modalName is /', function () {
      ReactGA.initialize('foo');
      ReactGA.modalview('/');
      spies.warn.args.should.eql([
        ['modalName cannot be an empty string or a single / in .modalview()']
      ]);
    });
  });
}

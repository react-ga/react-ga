import * as ReactGA from '../../src';

export default function pageviewTests(spies) {
  describe('pageview()', function () {
    it('should output debug info, if debug is on', function () {
      const options = { debug: true };
      ReactGA.initialize('foo', options);
      ReactGA.pageview('/valid');
      spies.info.args.should.eql([
        ["called ga('send', 'pageview', path);"],
        ['with path: /valid']
      ]);
    });

    it('should record a pageview', function () {
      ReactGA.initialize('foo');
      ReactGA.pageview('/valid');
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', { hitType: 'pageview', page: '/valid' }]
      ]);
    });

    it('should pass an optional title', function () {
      ReactGA.initialize('foo');
      ReactGA.pageview('/valid', null, 'Title');
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', { hitType: 'pageview', page: '/valid', title: 'Title' }]
      ]);
    });

    it('should record a pageview with multiple trackers', function () {
      ReactGA.initialize([
        { trackingId: 'foo' },
        { trackingId: 'bar', gaOptions: { name: 'baz' } }
      ]);
      ReactGA.pageview('/valid', ['baz']);
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['create', 'bar', { name: 'baz' }],
        ['send', { hitType: 'pageview', page: '/valid' }],
        ['baz.send', { hitType: 'pageview', page: '/valid' }]
      ]);
    });

    it('should abort, log warning if path is not provided', function () {
      ReactGA.initialize('foo');
      ReactGA.pageview();
      spies.warn.args.should.eql([
        ['path is required in .pageview()']
      ]);
    });

    it('should abort, log warning if path is empty string', function () {
      ReactGA.initialize('foo');
      ReactGA.pageview('');
      spies.warn.args.should.eql([
        ['path is required in .pageview()']
      ]);
    });

    it('should abort, log warning if path is empty string of spaces', function () {
      ReactGA.initialize('foo');
      ReactGA.pageview('  ');
      spies.warn.args.should.eql([
        ['path cannot be an empty string in .pageview()']
      ]);
    });
  });
}

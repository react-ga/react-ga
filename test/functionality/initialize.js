import * as ReactGA from '../../src';

export default function initializeTests(spies) {
  describe('initialize()', function () {
    it('should define window.ga', function () {
      ReactGA.initialize('foo');
      (typeof window.ga).should.eql('function');
    });

    it('should call window.ga()', function () {
      ReactGA.initialize('foo');
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto']
      ]);
    });

    it('should call window.ga() with ga options if they are given', function () {
      ReactGA.initialize('foo', { gaOptions: { userId: 123 } });
      spies.ga.args.should.eql([
        ['create', 'foo', { userId: 123 }]
      ]);
    });

    it('should initialize multiple trackers if they are given', function () {
      ReactGA.initialize([
        { trackingId: 'foo', gaOptions: { userId: 123 } },
        { trackingId: 'bar', gaOptions: { name: 'baz' } }
      ]);
      spies.ga.args.should.eql([
        ['create', 'foo', { userId: 123 }],
        ['create', 'bar', { name: 'baz' }]
      ]);
    });

    it('should error if initialize multiple trackers are missing trackingId', function () {
      ReactGA.initialize([
        { gaOptions: { userId: 123 } }
      ]);
      spies.warn.args.should.eql([
        ['gaTrackingID is required in initialize()']
      ]);
      spies.ga.args.should.eql([]);
    });

    it('should abort, log warning if tracking ID is not given', function () {
      ReactGA.initialize();
      spies.warn.args.should.eql([
        ['gaTrackingID is required in initialize()']
      ]);
      spies.ga.args.should.eql([]);
    });
  });
}

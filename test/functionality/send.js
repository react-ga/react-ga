import * as ReactGA from '../../src';

export default function sendTests(spies) {
  describe('send()', function () {
    it('should record a pageview using send', function () {
      ReactGA.initialize('foo');
      ReactGA.send({
        hitType: 'pageview',
        page: '/valid'
      });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        [
          'send',
          {
            hitType: 'pageview',
            page: '/valid'
          }
        ]
      ]);
    });

    it('should record an event using send', function () {
      ReactGA.initialize('foo');
      ReactGA.send({
        hitType: 'event',
        eventCategory: 'category',
        eventAction: 'action'
      });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        [
          'send',
          {
            hitType: 'event',
            eventCategory: 'category',
            eventAction: 'action'
          }
        ]
      ]);
    });

    it('should send to multiple trackers', function () {
      ReactGA.initialize([
        { trackingId: 'foo', gaOptions: { userId: 123 } },
        { trackingId: 'bar', gaOptions: { name: 'baz' } }
      ]);
      ReactGA.send({
        hitType: 'event',
        eventCategory: 'category',
        eventAction: 'action'
      }, ['baz']);
      spies.ga.args.should.eql([
        ['create', 'foo', { userId: 123 }],
        ['create', 'bar', { name: 'baz' }],
        [
          'send',
          {
            hitType: 'event',
            eventCategory: 'category',
            eventAction: 'action'
          }
        ],
        [
          'baz.send',
          {
            hitType: 'event',
            eventCategory: 'category',
            eventAction: 'action'
          }
        ]
      ]);
    });

    it('should send to default ', function () {
      ReactGA.initialize([
        { trackingId: 'foo', gaOptions: { userId: 123 } },
        { trackingId: 'bar', gaOptions: { name: 'baz' } }
      ], { alwaysSendToDefaultTracker: false });
      ReactGA.send({
        hitType: 'event',
        eventCategory: 'category',
        eventAction: 'action'
      }, ['baz']);
      spies.ga.args.should.eql([
        ['create', 'foo', { userId: 123 }],
        ['create', 'bar', { name: 'baz' }],
        [
          'baz.send',
          {
            hitType: 'event',
            eventCategory: 'category',
            eventAction: 'action'
          }
        ]
      ]);
    });

    it('should ignore the alwaysSendToDefaultTracker flag when no trackerNames are specified', function () {
      ReactGA.initialize([
        { trackingId: 'foo', gaOptions: { userId: 123 } },
        { trackingId: 'bar', gaOptions: { name: 'baz' } }
      ], { alwaysSendToDefaultTracker: false });
      ReactGA.send({
        hitType: 'event',
        eventCategory: 'category',
        eventAction: 'action'
      });
      spies.ga.args.should.eql([
        ['create', 'foo', { userId: 123 }],
        ['create', 'bar', { name: 'baz' }],
        [
          'send',
          {
            hitType: 'event',
            eventCategory: 'category',
            eventAction: 'action'
          }
        ]
      ]);
    });
  });
}

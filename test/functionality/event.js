import * as ReactGA from '../../src';

export default function eventTests(spies) {
  describe('event()', function () {
    it('should record an event', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test' });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          hitType: 'event'
        }]
      ]);
    });

    it('should record an event with multiple trackers', function () {
      ReactGA.initialize([
        { trackingId: 'foo' },
        { trackingId: 'bar', gaOptions: { name: 'baz' } }
      ]);
      ReactGA.event({ category: 'Test', action: 'Send Test' }, ['baz']);
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['create', 'bar', { name: 'baz' }],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          hitType: 'event'
        }],
        ['baz.send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          hitType: 'event'
        }]
      ]);
    });

    it('should record an event with strings converted to titleCase', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'test', action: 'send test' });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          hitType: 'event'
        }]
      ]);
    });

    it('should not convert strings to titleCase if the flag is false', function () {
      ReactGA.initialize('foo', { titleCase: false });
      ReactGA.event({ category: 'test', action: 'send test' });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'send test',
          eventCategory: 'test',
          hitType: 'event'
        }]
      ]);
    });

    it('should warn if args object is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.event();
      spies.warn.args.should.eql([
        ['args.category AND args.action are required in event()']
      ]);
    });

    it('should warn if category is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ action: 'Send Test' });
      spies.warn.args.should.eql([
        ['args.category AND args.action are required in event()']
      ]);
    });

    it('should warn if category is empty string', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: '', action: 'Send Test' });
      spies.warn.args.should.eql([
        ['args.category AND args.action are required in event()']
      ]);
    });

    it('should warn if action is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test' });
      spies.warn.args.should.eql([
        ['args.category AND args.action are required in event()']
      ]);
    });

    it('should warn if action is empty string', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: '' });
      spies.warn.args.should.eql([
        ['args.category AND args.action are required in event()']
      ]);
    });

    it('should record a label value', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test', label: 'Test Label Value' });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          eventLabel: 'Test Label Value',
          hitType: 'event'
        }]
      ]);
    });

    it('should record a value value', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test', value: 10 });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          eventValue: 10,
          hitType: 'event'
        }]
      ]);
    });

    it('should record a value value of zero', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test', value: 0 });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          eventValue: 0,
          hitType: 'event'
        }]
      ]);
    });

    it('should reject a non-numeric value value', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test', value: 'millions' });
      spies.warn.args.should.eql([[
        'Expected `args.value` arg to be a Number.'
      ]]);
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          hitType: 'event'
        }]
      ]);
    });

    it('should record a nonInteraction value', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test', nonInteraction: true });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          nonInteraction: true,
          hitType: 'event'
        }]
      ]);
    });

    it('should reject a non-boolean nonInteraction value', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test', nonInteraction: 'yeahsure' });
      spies.warn.args.should.eql([[
        '`args.nonInteraction` must be a boolean.'
      ]]);
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          hitType: 'event'
        }]
      ]);
    });

    it('should record a valid transport value', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test', transport: 'beacon' });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          transport: 'beacon',
          hitType: 'event'
        }]
      ]);
    });

    it('should reject a non-string transport value', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test', transport: true });
      spies.warn.args.should.eql([[
        '`args.transport` must be a string.'
      ]]);
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          hitType: 'event'
        }]
      ]);
    });

    it('should warn but allow an invalid transport value string', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test', transport: 'lolwut' });
      spies.warn.args.should.eql([[
        '`args.transport` must be either one of these values: '
        + '`beacon`, `xhr` or `image`'
      ]]);
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          transport: 'lolwut',
          hitType: 'event'
        }]
      ]);
    });
  });
}

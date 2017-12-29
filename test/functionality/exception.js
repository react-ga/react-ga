import * as ReactGA from '../../src';

export default function exceptionTests(spies) {
  describe('exception()', function () {
    it('should record an exception', function () {
      ReactGA.initialize('foo');
      ReactGA.exception({});
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', { hitType: 'exception' }]
      ]);
    });

    it('should record a description value', function () {
      ReactGA.initialize('foo');
      ReactGA.exception({ description: 'This is an exception!' });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', { exDescription: 'This Is an Exception!', hitType: 'exception' }]
      ]);
    });

    it('should record a fatal value', function () {
      ReactGA.initialize('foo');
      ReactGA.exception({ fatal: true });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', { exFatal: true, hitType: 'exception' }]
      ]);
    });

    it('should reject a non-boolean fatal value', function () {
      ReactGA.initialize('foo');
      ReactGA.exception({ fatal: 'this-is-fatal' });
      spies.warn.args.should.eql([[
        '`args.fatal` must be a boolean.'
      ]]);
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', { hitType: 'exception' }]
      ]);
    });
  });
}

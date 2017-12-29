import * as ReactGA from '../../src';

export default function timingTests(spies) {
  describe('timing()', function () {
    it('should warn if args object is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.timing();
      spies.warn.args.should.eql([
        ['args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number']
      ]);
    });

    it('should warn if category arg is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ variable: 'Timing test', value: 1000 });
      spies.warn.args.should.eql([
        ['args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number']
      ]);
    });

    it('should warn if category arg is empty string value', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ category: '', variable: 'Timing test', value: 1000 });
      spies.warn.args.should.eql([
        ['args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number']
      ]);
    });

    it('should warn if variable arg is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ category: 'Test', value: 1000 });
      spies.warn.args.should.eql([
        ['args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number']
      ]);
    });

    it('should warn if variable arg is empty string value', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ category: 'Test', value: 1000, variable: '' });
      spies.warn.args.should.eql([
        ['args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number']
      ]);
    });

    it('should warn if value arg is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ category: 'Test', variable: 'Timing test' });
      spies.warn.args.should.eql([
        ['args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number']
      ]);
    });

    it('should warn if value arg is not a number', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ category: 'Test', variable: 'Timing test', value: 'Not a number' });
      spies.warn.args.should.eql([
        ['args.category, args.variable AND args.value are required in timing() ' +
        'AND args.value has to be a number']
      ]);
    });

    it('should create timing event without timingLabel', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ category: 'Test', variable: 'Timing test', value: 1000 });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          timingVar: 'Timing Test',
          timingCategory: 'Test',
          timingValue: 1000,
          hitType: 'timing'
        }]
      ]);
    });

    it('should create timing event with timingLabel', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({
        category: 'Test',
        variable: 'Timing test',
        value: 1000,
        label: 'Timing test label'
      });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          timingVar: 'Timing Test',
          timingCategory: 'Test',
          timingValue: 1000,
          timingLabel: 'Timing Test Label',
          hitType: 'timing'
        }]
      ]);
    });
  });
}

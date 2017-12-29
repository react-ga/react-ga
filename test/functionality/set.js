import * as ReactGA from '../../src';

export default function setTests(spies) {
  describe('set()', function () {
    it('should output debug info, if debug is on', function () {
      ReactGA.initialize('foo', { debug: true });
      ReactGA.set({ userId: 123 });
      spies.info.args.should.eql([
        ["called ga('set', fieldsObject);"],
        ['with fieldsObject: {"userId":123}']
      ]);
    });

    it('should warn if fieldsObject object is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.set();
      spies.warn.args.should.eql([
        ['`fieldsObject` is required in .set()']
      ]);
    });

    it('should warn if fieldsObject is not an Object', function () {
      ReactGA.initialize('foo');
      ReactGA.set(123);
      spies.warn.args.should.eql([
        ['Expected `fieldsObject` arg to be an Object']
      ]);
    });

    it('should warn if fieldsObject object is an empty object', function () {
      ReactGA.initialize('foo');
      ReactGA.set({});
      spies.warn.args.should.eql([
        ['empty `fieldsObject` given to .set()']
      ]);
    });

    it('should set the field values', function () {
      ReactGA.initialize('foo');
      ReactGA.set({ userId: 123 });
      spies.ga.args.should.eql([
        ['create', 'foo', 'auto'],
        ['set', { userId: 123 }]
      ]);
    });
  });
}

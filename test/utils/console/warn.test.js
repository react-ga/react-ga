var should = require('should');
var sinon = require('sinon');

var warn = require('../../../src/utils/console/warn');

describe('warn()', function () {
  it('should append [react-ga] to warning messages', function () {
    sinon.stub(console, 'warn');
    console.warn.callCount.should.eql(0);
    warn('foo bar');
    console.warn.callCount.should.eql(1);
    console.warn.getCall(0).args.should.eql(['[react-ga]', 'foo bar']);
    console.warn.restore();
  });
});

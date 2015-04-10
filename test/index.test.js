var should = require('should');
var sinon = require('sinon');

var ga = require('../src/index');

var GLOBALS = ['ga', 'GoogleAnalyticsObject', 'window', 'document'];

describe('react-ga', function() {
  function getGaCalls() {
    var q = (window.ga && window.ga.q) || [];

    return q.map(function(args) {
      return [].slice.call(args);
    });
  }

  beforeEach(function() {
    sinon.stub(console, 'warn');
    global.window = global;
    global.document = {
      createElement: function(name) {
        return {};
      },
      getElementsByTagName: function(name) {
        return [{
          parentNode: {
            insertBefore: function() {}
          }
        }];
      }
    };
  });

  afterEach(function() {
    console.warn.restore();
    GLOBALS.forEach(function(name) {
      delete global[name];
    });
  });

  describe('initialize()', function() {
    it('should define window.ga', function() {
      ga.initialize('foo');
      (typeof window.ga).should.equal('function');
    });

    it('should call window.ga()', function() {
      ga.initialize('foo');
      getGaCalls().should.eql([['create', 'foo', 'auto']]);
    });

    it('should abort, log warning if tracking ID is not given', function() {
      ga.initialize();
      console.warn.args.should.eql([[
        '[react-ga]', 'gaTrackingID is required in initialize()'
      ]]);
      getGaCalls().should.eql([]);
    });
  });
});

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
    sinon.stub(console, 'info');
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
    console.info.restore();
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

  /**
   * pageview()
   */

  describe('pageview()', function() {

    it('should output degug info, if debug is on', function() {
      var options = { debug: true };
      ga.initialize('foo', options);
      ga.pageview('/valid');
      console.info.args.should.eql([
        [ "[react-ga]", "called ga('send', 'pageview', path);" ],
        [ "[react-ga]", "with path: /valid" ]
      ]);
    });

    it('should record a pageview', function() {
      ga.initialize('foo');
      ga.pageview('/valid');
      getGaCalls().should.eql([ [ 'create', 'foo', 'auto' ],
                                [ 'send', 'pageview', '/valid' ] ]);
    });

    it('should abort, log warning if path is not provided', function() {
      ga.initialize('foo');
      ga.pageview();
      console.warn.args.should.eql([[
        '[react-ga]', 'path is required in .pageview()'
      ]]);
    });

    it('should abort, log warning if path is empty string', function() {
      ga.initialize('foo');
      ga.pageview('');
      console.warn.args.should.eql([[
        '[react-ga]', 'path is required in .pageview()'
      ]]);
    });

    it('should abort, log warning if path is empty string of spaces', function() {
      ga.initialize('foo');
      ga.pageview('  ');
      console.warn.args.should.eql([[
        '[react-ga]', 'path cannot be an empty string in .pageview()'
      ]]);
    });
  });

  /**
   * modalview()
   */

  describe('modalview()', function() {

    it('should output degug info, if debug is on', function() {
      var options = { debug: true };
      ga.initialize('foo', options);
      ga.modalview('valid');
      console.info.args.should.eql([
        [ "[react-ga]", "called ga('send', 'pageview', path);" ],
        [ "[react-ga]", "with path: /modal/valid" ]
      ]);
    });

    it('should record a modalview', function() {
      ga.initialize('foo');
      ga.modalview('valid');
      getGaCalls().should.eql([ [ 'create', 'foo', 'auto' ],
                                [ 'send', 'pageview', '/modal/valid' ] ]);
    });

    it('should remove a leading slash', function() {
      ga.initialize('foo');
      ga.modalview('/valid');
      getGaCalls().should.eql([ [ 'create', 'foo', 'auto' ],
                                [ 'send', 'pageview', '/modal/valid' ] ]);
    });

    it('should abort, log warning if modalName is not provided', function() {
      ga.initialize('foo');
      ga.modalview();
      console.warn.args.should.eql([[
        '[react-ga]', 'modalName is required in .modalview(modalName)'
      ]]);
    });

    it('should abort, log warning if modalName is empty string', function() {
      ga.initialize('foo');
      ga.modalview('');
      console.warn.args.should.eql([[
        '[react-ga]', 'modalName is required in .modalview(modalName)'
      ]]);
    });

    it('should abort, log warning if modalName is empty string of spaces', function() {
      ga.initialize('foo');
      ga.modalview('  ');
      console.warn.args.should.eql([[
        '[react-ga]', 'modalName cannot be an empty string or a single / in .modalview()'
      ]]);
    });

    it('should abort, log warning if modalName is /', function() {
      ga.initialize('foo');
      ga.modalview('/');
      console.warn.args.should.eql([[
        '[react-ga]', 'modalName cannot be an empty string or a single / in .modalview()'
      ]]);
    });
  });

  /**
   * event()
   */

  describe('event()', function() {

    it('should record an event', function() {
      ga.initialize('foo');
      ga.event( { category: 'Test', action: 'Send Test' } );
      getGaCalls().should.eql([ [ 'create', 'foo', 'auto' ],
                                [ 'send', { eventAction: 'Send Test',
                                            eventCategory: 'Test',
                                            hitType: 'event'
                                          }]
                                ]);
    });

    it('should warn if args object is missing', function() {
      ga.initialize('foo');
      ga.event();
      console.warn.args.should.eql([[
        '[react-ga]', 'args.category AND args.action are required in event()'
      ]]);
    });

    it('should warn if category is missing', function() {
      ga.initialize('foo');
      ga.event( { action: 'Send Test' } );
      console.warn.args.should.eql([[
        '[react-ga]', 'args.category AND args.action are required in event()'
      ]]);
    });

    it('should warn if category is empty string', function() {
      ga.initialize('foo');
      ga.event( { category: '', action: 'Send Test' } );
      console.warn.args.should.eql([[
        '[react-ga]', 'args.category AND args.action are required in event()'
      ]]);
    });

    it('should warn if action is missing', function() {
      ga.initialize('foo');
      ga.event( { category: 'Test' } );
      console.warn.args.should.eql([[
        '[react-ga]', 'args.category AND args.action are required in event()'
      ]]);
    });

    it('should warn if action is empty string', function() {
      ga.initialize('foo');
      ga.event( { category: 'Test', action: '' } );
      console.warn.args.should.eql([[
        '[react-ga]', 'args.category AND args.action are required in event()'
      ]]);
    });

    it('should record a label value', function() {
      ga.initialize('foo');
      ga.event( { category: 'Test', action: 'Send Test', label: 'Test Label Value' } );
      getGaCalls().should.eql([ [ 'create', 'foo', 'auto' ],
                                [ 'send', { eventAction: 'Send Test',
                                            eventCategory: 'Test',
                                            eventLabel: 'Test Label Value',
                                            hitType: 'event'
                                          }]
                                ]);
    });

    it('should record a value value', function() {
      ga.initialize('foo');
      ga.event( { category: 'Test', action: 'Send Test', value: 10 } );
      getGaCalls().should.eql([ [ 'create', 'foo', 'auto' ],
                                [ 'send', { eventAction: 'Send Test',
                                            eventCategory: 'Test',
                                            eventValue: 10,
                                            hitType: 'event'
                                          }]
                                ]);
    });

    it('should reject a non-numeric value value', function() {
      ga.initialize('foo');
      ga.event( { category: 'Test', action: 'Send Test', value: 'millions' } );
      console.warn.args.should.eql([[
        '[react-ga]', 'Expected `args.value` arg to be a Number.'
      ]]);
      getGaCalls().should.eql([ [ 'create', 'foo', 'auto' ],
                                [ 'send', { eventAction: 'Send Test',
                                            eventCategory: 'Test',
                                            hitType: 'event'
                                          }]
                                ]);
    });

    it('should record a nonInteraction value', function() {
      ga.initialize('foo');
      ga.event( { category: 'Test', action: 'Send Test', nonInteraction: true } );
      getGaCalls().should.eql([ [ 'create', 'foo', 'auto' ],
                                [ 'send', { eventAction: 'Send Test',
                                            eventCategory: 'Test',
                                            nonInteraction: true,
                                            hitType: 'event'
                                          }]
                                ]);
    });

    it('should reject a non-boolean nonInteraction value', function() {
      ga.initialize('foo');
      ga.event( { category: 'Test', action: 'Send Test', nonInteraction: 'yeahsure' } );
      console.warn.args.should.eql([[
        '[react-ga]', '`args.nonInteraction` must be a boolean.'
      ]]);
      getGaCalls().should.eql([ [ 'create', 'foo', 'auto' ],
                                [ 'send', { eventAction: 'Send Test',
                                            eventCategory: 'Test',
                                            hitType: 'event'
                                          }]
                                ]);
    });
  });

  /**
   * outboundLink()
   */

  describe('outboundLink()', function() {

    it('should record an outboundLink event', function() {

      ga.initialize('foo');
      ga.outboundLink( { label: 'Test Click' }, function () {
      } );

      getGaCalls().should.eql([ [ 'create', 'foo', 'auto' ],
                                [ 'send', { eventAction: 'Click',
                                            eventCategory: 'Outbound',
                                            eventLabel: 'Test Click',
                                            hitCallback: undefined,
                                            hitType: 'event'
                                          }]
                                ]);

    });

    it('should warn if all args are missing', function() {
      ga.initialize('foo');
      ga.outboundLink();
      console.warn.args.should.eql([[
        '[react-ga]', 'hitCallback function is required'
      ]]);
    });

    it('should warn if label arg is missing', function() {
      ga.initialize('foo');
      ga.outboundLink( { missing: 'labelarg' }, function () {
        // do nothing on callback
      } );
      console.warn.args.should.eql([[
        '[react-ga]', 'args.label is required in outboundLink()'
      ]]);
    });

    it('should warn if hitCallback is missing', function() {
      ga.initialize('foo');
      ga.outboundLink( { label: 'Missing hitCallback' } );
      console.warn.args.should.eql([[
        '[react-ga]', 'hitCallback function is required'
      ]]);
    });

    it('should fire hitCallback even if ga is not defined', function(done) {
      ga.outboundLink( { label: 'http://www.google.com' }, function () {
        done();
      });
    });

    // TODO: solve how to simulate lack of response from GA
    // it('should fire hitCallback if ga is unavailable', function(done) {
    //   // use fake timers to simulate lack of response from GA
    //   this.clock = sinon.useFakeTimers();

    //   ga.initialize('foo');
    //   ga.outboundLink( { label: 'http://www.google.com' }, function () {
    //     done();
    //   });
    //   this.clock.restore();
    // });
  });

});

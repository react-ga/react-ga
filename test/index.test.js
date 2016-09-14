var should = require('should');
var sinon = require('sinon');
var React = require('react');
var TestUtils = require('react-addons-test-utils');

var ReactGA = require('../src/index');

var GLOBALS = ['ga', 'GoogleAnalyticsObject', 'window', 'document'];

describe('react-ga', function () {
  function getGaCalls() {
    var q = (window.ga && window.ga.q) || [];

    return q.map(function (args) {
      return [].slice.call(args);
    });
  }

  beforeEach(function () {
    sinon.stub(console, 'warn');
    sinon.stub(console, 'info');
    global.window = global;
    global.document = {
      createElement: function (name) {
        return {};
      },

      getElementsByTagName: function (name) {
        return [{
          parentNode: {
            insertBefore: function () {}
          }
        }];
      }
    };
  });

  afterEach(function () {
    console.warn.restore();
    console.info.restore();
    GLOBALS.forEach(function (name) {
      delete global[name];
    });
  });

  describe('initialize()', function () {
    it('should define window.ga', function () {
      ReactGA.initialize('foo');
      (typeof window.ga).should.eql('function');
    });

    it('should call window.ga()', function () {
      ReactGA.initialize('foo');
      getGaCalls().should.eql([
        ['create', 'foo', 'auto']
      ]);
    });

    it('should call window.ga() with ga options if they are given', function () {
      ReactGA.initialize('foo', { gaOptions: { userId: 123 } });
      getGaCalls().should.eql([
        ['create', 'foo', { userId: 123 }]
      ]);
    });

    it('should abort, log warning if tracking ID is not given', function () {
      ReactGA.initialize();
      console.warn.args.should.eql([
        ['[react-ga]', 'gaTrackingID is required in initialize()']
      ]);
      getGaCalls().should.eql([]);
    });
  });

  /**
   * ga()
   */

  describe('ga()', function () {
    it('should return the same object as window.ga when no arguments are passed', function () {
      ReactGA.initialize('foo');
      (ReactGA.ga() === window.ga).should.eql(true);
    });

    it('should send the correct arguments to window.ga when arguments are passed', function () {
      ReactGA.initialize('foo');
      ReactGA.ga('send', 'pageview', '/mypage');
      getGaCalls().should.eql([
        ['create', 'foo', 'auto'],
        ['send', 'pageview', '/mypage']
      ]);
    });

    it('should output debug info, if debug is on', function () {
      ReactGA.initialize('foo', { debug: true });
      ReactGA.ga('send', 'pageview', '/mypage');
      console.info.args.should.eql([
        ['[react-ga]', "called ga('arguments');"],
        ['[react-ga]', 'with arguments: ["send","pageview","/mypage"]']
      ]);
    });
  });

  /**
   * set()
   */

  describe('set()', function () {

    it('should output debug info, if debug is on', function () {
      ReactGA.initialize('foo', { debug: true });
      ReactGA.set({ userId: 123 });
      console.info.args.should.eql([
        ['[react-ga]', "called ga('set', fieldsObject);"],
        ['[react-ga]', 'with fieldsObject: {"userId":123}']
      ]);
    });

    it('should warn if fieldsObject object is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.set();
      console.warn.args.should.eql([
        ['[react-ga]', '`fieldsObject` is required in .set()']
      ]);
    });

    it('should warn if fieldsObject is not an Object', function () {
      ReactGA.initialize('foo');
      ReactGA.set(123);
      console.warn.args.should.eql([
        ['[react-ga]', 'Expected `fieldsObject` arg to be an Object']
      ]);
    });

    it('should warn if fieldsObject object is an empty object', function () {
      ReactGA.initialize('foo');
      ReactGA.set({});
      console.warn.args.should.eql([
        ['[react-ga]', 'empty `fieldsObject` given to .set()']
      ]);
    });

    it('should set the field values', function () {
      ReactGA.initialize('foo');
      ReactGA.set({ userId: 123 });
      getGaCalls().should.eql([
        ['create', 'foo', 'auto'],
        ['set', { userId: 123 }]
      ]);
    });
  });

  /**
   * send()
   */

  describe('send()', function () {
    it('should record a pageview using send', function () {
      ReactGA.initialize('foo');
      ReactGA.send({
        hitType: 'pageview',
        page: '/valid'
      });
      getGaCalls().should.eql([
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
      getGaCalls().should.eql([
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
  });

  /**
   * pageview()
   */

  describe('pageview()', function () {

    it('should output debug info, if debug is on', function () {
      var options = { debug: true };
      ReactGA.initialize('foo', options);
      ReactGA.pageview('/valid');
      console.info.args.should.eql([
        ['[react-ga]', "called ga('send', 'pageview', path);"],
        ['[react-ga]', 'with path: /valid']
      ]);
    });

    it('should record a pageview', function () {
      ReactGA.initialize('foo');
      ReactGA.pageview('/valid');
      getGaCalls().should.eql([
        ['create', 'foo', 'auto'],
        ['send', 'pageview', '/valid']
      ]);
    });

    it('should abort, log warning if path is not provided', function () {
      ReactGA.initialize('foo');
      ReactGA.pageview();
      console.warn.args.should.eql([
        ['[react-ga]', 'path is required in .pageview()']
      ]);
    });

    it('should abort, log warning if path is empty string', function () {
      ReactGA.initialize('foo');
      ReactGA.pageview('');
      console.warn.args.should.eql([
        ['[react-ga]', 'path is required in .pageview()']
      ]);
    });

    it('should abort, log warning if path is empty string of spaces', function () {
      ReactGA.initialize('foo');
      ReactGA.pageview('  ');
      console.warn.args.should.eql([
        ['[react-ga]', 'path cannot be an empty string in .pageview()']
      ]);
    });
  });

  /**
   * modalview()
   */

  describe('modalview()', function () {

    it('should output debug info, if debug is on', function () {
      var options = { debug: true };
      ReactGA.initialize('foo', options);
      ReactGA.modalview('valid');
      console.info.args.should.eql([
        ['[react-ga]', "called ga('send', 'pageview', path);"],
        ['[react-ga]', 'with path: /modal/valid']
      ]);
    });

    it('should record a modalview', function () {
      ReactGA.initialize('foo');
      ReactGA.modalview('valid');
      getGaCalls().should.eql([
        ['create', 'foo', 'auto'],
        ['send', 'pageview', '/modal/valid']
      ]);
    });

    it('should remove a leading slash', function () {
      ReactGA.initialize('foo');
      ReactGA.modalview('/valid');
      getGaCalls().should.eql([
        ['create', 'foo', 'auto'],
        ['send', 'pageview', '/modal/valid']
      ]);
    });

    it('should abort, log warning if modalName is not provided', function () {
      ReactGA.initialize('foo');
      ReactGA.modalview();
      console.warn.args.should.eql([
        ['[react-ga]', 'modalName is required in .modalview(modalName)']
      ]);
    });

    it('should abort, log warning if modalName is empty string', function () {
      ReactGA.initialize('foo');
      ReactGA.modalview('');
      console.warn.args.should.eql([
        ['[react-ga]', 'modalName is required in .modalview(modalName)']
      ]);
    });

    it('should abort, log warning if modalName is empty string of spaces', function () {
      ReactGA.initialize('foo');
      ReactGA.modalview('  ');
      console.warn.args.should.eql([
        ['[react-ga]', 'modalName cannot be an empty string or a single / in .modalview()']
      ]);
    });

    it('should abort, log warning if modalName is /', function () {
      ReactGA.initialize('foo');
      ReactGA.modalview('/');
      console.warn.args.should.eql([
        ['[react-ga]', 'modalName cannot be an empty string or a single / in .modalview()']
      ]);
    });
  });

  /**
   * exception()
   */

  describe('exception()', function () {

    it('should record an exception', function () {
      ReactGA.initialize('foo');
      ReactGA.exception({});
      getGaCalls().should.eql([
        ['create', 'foo', 'auto'],
        ['send', { hitType: 'exception' }]
      ]);
    });

    it('should record a description value', function () {
      ReactGA.initialize('foo');
      ReactGA.exception({ description: 'This is an exception!' });
      getGaCalls().should.eql([
        ['create', 'foo', 'auto'],
        ['send', { exDescription: 'This Is an Exception!', hitType: 'exception' }]
      ]);
    });

    it('should record a fatal value', function () {
      ReactGA.initialize('foo');
      ReactGA.exception({ fatal: true });
      getGaCalls().should.eql([
        ['create', 'foo', 'auto'],
        ['send', { exFatal: true, hitType: 'exception' }]
      ]);
    });

    it('should reject a non-boolean fatal value', function () {
      ReactGA.initialize('foo');
      ReactGA.exception({ fatal: 'this-is-fatal' });
      console.warn.args.should.eql([[
        '[react-ga]', '`args.fatal` must be a boolean.'
      ]]);
      getGaCalls().should.eql([
        ['create', 'foo', 'auto'],
        ['send', { hitType: 'exception' }]
      ]);
    });
  });

  /**
   * timing()
   */

  describe('timing()', function () {
    it('should warn if args object is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.timing();
      console.warn.args.should.eql([
        ['[react-ga]', 'args.category, args.variable AND args.value are required in timing() ' +
                        'AND args.value has to be a number']
      ]);
    });

    it('should warn if category arg is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ variable: 'Timing test', value: 1000 });
      console.warn.args.should.eql([
        ['[react-ga]', 'args.category, args.variable AND args.value are required in timing() ' +
                        'AND args.value has to be a number']
      ]);
    });

    it('should warn if category arg is empty string value', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ category: '', variable: 'Timing test', value: 1000 });
      console.warn.args.should.eql([
        ['[react-ga]', 'args.category, args.variable AND args.value are required in timing() ' +
                        'AND args.value has to be a number']
      ]);
    });

    it('should warn if variable arg is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ category: 'Test', value: 1000 });
      console.warn.args.should.eql([
        ['[react-ga]', 'args.category, args.variable AND args.value are required in timing() ' +
                        'AND args.value has to be a number']
      ]);
    });

    it('should warn if variable arg is empty string value', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ category: 'Test', value: 1000, variable: '' });
      console.warn.args.should.eql([
        ['[react-ga]', 'args.category, args.variable AND args.value are required in timing() ' +
                        'AND args.value has to be a number']
      ]);
    });

    it('should warn if value arg is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ category: 'Test', variable: 'Timing test' });
      console.warn.args.should.eql([
        ['[react-ga]', 'args.category, args.variable AND args.value are required in timing() ' +
                        'AND args.value has to be a number']
      ]);
    });

    it('should warn if value arg is not a number', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ category: 'Test', variable: 'Timing test', value: 'Not a number' });
      console.warn.args.should.eql([
        ['[react-ga]', 'args.category, args.variable AND args.value are required in timing() ' +
                        'AND args.value has to be a number']
      ]);
    });

    it('should create timing event without timingLabel', function () {
      ReactGA.initialize('foo');
      ReactGA.timing({ category: 'Test', variable: 'Timing test', value: 1000 });
      getGaCalls().should.eql([
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
      ReactGA.timing({ category: 'Test', variable: 'Timing test',
                  value: 1000, label: 'Timing test label' });
      getGaCalls().should.eql([
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

  /**
   * event()
   */

  describe('event()', function () {
    it('should record an event', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test' });
      getGaCalls().should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          hitType: 'event'
        }]
      ]);
    });

    it('should record an event with strings converted to titleCase', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'test', action: 'send test' });
      getGaCalls().should.eql([
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
      getGaCalls().should.eql([
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
      console.warn.args.should.eql([
        ['[react-ga]', 'args.category AND args.action are required in event()']
      ]);
    });

    it('should warn if category is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ action: 'Send Test' });
      console.warn.args.should.eql([
        ['[react-ga]', 'args.category AND args.action are required in event()']
      ]);
    });

    it('should warn if category is empty string', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: '', action: 'Send Test' });
      console.warn.args.should.eql([
        ['[react-ga]', 'args.category AND args.action are required in event()']
      ]);
    });

    it('should warn if action is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test' });
      console.warn.args.should.eql([
        ['[react-ga]', 'args.category AND args.action are required in event()']
      ]);
    });

    it('should warn if action is empty string', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: '' });
      console.warn.args.should.eql([
        ['[react-ga]', 'args.category AND args.action are required in event()']
      ]);
    });

    it('should record a label value', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test', label: 'Test Label Value' });
      getGaCalls().should.eql([
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
      getGaCalls().should.eql([
        ['create', 'foo', 'auto'],
        ['send', {
          eventAction: 'Send Test',
          eventCategory: 'Test',
          eventValue: 10,
          hitType: 'event'
        }]
      ]);
    });

    it('should reject a non-numeric value value', function () {
      ReactGA.initialize('foo');
      ReactGA.event({ category: 'Test', action: 'Send Test', value: 'millions' });
      console.warn.args.should.eql([[
        '[react-ga]', 'Expected `args.value` arg to be a Number.'
      ]]);
      getGaCalls().should.eql([
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
      getGaCalls().should.eql([
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
      console.warn.args.should.eql([[
        '[react-ga]', '`args.nonInteraction` must be a boolean.'
      ]]);
      getGaCalls().should.eql([
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
      getGaCalls().should.eql([
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
      console.warn.args.should.eql([[
        '[react-ga]', '`args.transport` must be a string.'
      ]]);
      getGaCalls().should.eql([
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
      console.warn.args.should.eql([[
        '[react-ga]', '`args.transport` must be either one of these values: '
                    + '`beacon`, `xhr` or `image`'
      ]]);
      getGaCalls().should.eql([
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

  /**
   * outboundLink()
   */

  describe('outboundLink()', function () {
    it('should record an outboundLink event', function (done) {
      ReactGA.initialize('foo');
      ReactGA.outboundLink({ label: 'Test Click' }, function () {
        // we need a reference to the function to compare in the
        // getGaCalls() test below
        var functionCalledBack = getGaCalls()[1][1].hitCallback;
        functionCalledBack.should.be.a.Function; // jshint ignore:line

        getGaCalls().should.eql([
          ['create', 'foo', 'auto'],
          ['send', {
            eventAction: 'Click',
            eventCategory: 'Outbound',
            eventLabel: 'Test Click',
            hitCallback: functionCalledBack,
            hitType: 'event'
          }]
        ]);
        done();
      });
    });

    it('should warn if all args are missing', function () {
      ReactGA.initialize('foo');
      ReactGA.outboundLink();
      console.warn.args.should.eql([[
        '[react-ga]', 'hitCallback function is required'
      ]]);
    });

    it('should warn if label arg is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.outboundLink({ missing: 'labelarg' }, function () {
        // do nothing on callback
      });

      console.warn.args.should.eql([[
        '[react-ga]', 'args.label is required in outboundLink()'
      ]]);
    });

    it('should warn if hitCallback is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.outboundLink({ label: 'Missing hitCallback' });
      console.warn.args.should.eql([[
        '[react-ga]', 'hitCallback function is required'
      ]]);
    });

    it('should fire hitCallback if ga is defined', function (done) {
      ReactGA.initialize('foo');
      ReactGA.outboundLink({ label: 'http://www.google.com' }, function () {
        done();
      });
    });

    it('should fire hitCallback if ga is not defined', function (done) {
      ReactGA.outboundLink({ label: 'http://www.google.com' }, function () {
        done();
      });
    });

    it('should fire hitCallback if ga is available and responds in under 250ms', function (done) {
      // use fake timers to simulate response time from GA
      this.clock = sinon.useFakeTimers();

      ReactGA.initialize('foo');
      var simulateGACallback = function () {
        done();
      };

      ReactGA.outboundLink({ label: 'http://www.google.com' }, simulateGACallback);

      this.clock.tick(125);
      var functionCalledBack = getGaCalls()[1][1].hitCallback;
      functionCalledBack();
      this.clock.restore();
    });

    it('should not fire hitCallback twice if ga responds after 250ms', function (done) {
      // use fake timers to simulate response time from GA
      this.clock = sinon.useFakeTimers();

      ReactGA.initialize('foo');
      var simulateGACallback = function () {
        done();
      };

      ReactGA.outboundLink({ label: 'http://www.google.com' }, simulateGACallback);

      this.clock.tick(260);
      var functionCalledBack = getGaCalls()[1][1].hitCallback;
      functionCalledBack();
      this.clock.restore();
    });

    it('should fire hitCallback if ga is not available after 250ms', function (done) {
      ReactGA.initialize('foo');
      var simulateGACallback = function () {
        done();
      };

      ReactGA.outboundLink({ label: 'http://www.google.com' }, simulateGACallback);

      var simulatedResponseTime = 275;
      setTimeout(function () {
        should.fail('no response ' + simulatedResponseTime + ' ms', 'response after 250 ms',
                    'message', 'operator');
      }, simulatedResponseTime);
    });
  });

  /**
   * OutboundLink()
   */

  describe('OutboundLink()', function () {
    it('should create a React component <OutboundLink>', function () {
      ReactGA.initialize();

      var OutboundLinkComponent = ReactGA.OutboundLink;
      TestUtils.isElement(OutboundLinkComponent);
      OutboundLinkComponent.displayName.should.eql('OutboundLink');
    });

  });

  /**
   * plugin()
   */

  describe('Plugin', function () {

    it('should require the plugin: ecommerce', function () {
      ReactGA.initialize('plugin');
      ReactGA.plugin.require('ecommerce');

      getGaCalls().should.eql([
        ['create', 'plugin', 'auto'],
        ['require', 'ecommerce']
      ]);
    });

    it('should execute ecommerce:addItem', function () {
      ReactGA.initialize('plugin');
      ReactGA.plugin.execute('ecommerce', 'addItem', { id: 1, name: 'Product' });

      getGaCalls().should.eql([
        ['create', 'plugin', 'auto'],
        ['ecommerce:addItem', { id: 1, name: 'Product' }]
      ]);
    });

    it('should execute ec:setAction \'checkout\' with payload { \'step\': 1 }', function () {
      ReactGA.initialize('plugin');
      ReactGA.plugin.execute('ec', 'setAction', 'checkout', { step: 1 });
      getGaCalls().should.eql([
        ['create', 'plugin', 'auto'],
        ['ec:setAction', 'checkout', { step: 1 }]
      ]);
    });

    it('should execute ecommerce:addItem', function () {
      ReactGA.initialize('plugin');
      ReactGA.plugin.execute('ecommerce', 'addItem', {
        id: 1,
        name: 'Product'
      });

      getGaCalls().should.eql([
        ['create', 'plugin', 'auto'],
        ['ecommerce:addItem', { id: 1, name: 'Product' }]
      ]);
    });

    it('should execute ecommerce:send', function () {
      ReactGA.initialize('plugin');
      ReactGA.plugin.execute('ecommerce', 'send');
      getGaCalls().should.eql([
        ['create', 'plugin', 'auto'],
        ['ecommerce:send']
      ]);
    });

    it('should execute ec:setAction \'checkout\' with payload { \'step\': 1 }', function () {
      ReactGA.initialize('plugin');
      ReactGA.plugin.execute('ec', 'setAction', 'checkout', { step: 1 });
      getGaCalls().should.eql([
        ['create', 'plugin', 'auto'],
        ['ec:setAction', 'checkout', { step: 1 }]
      ]);
    });
  });
});

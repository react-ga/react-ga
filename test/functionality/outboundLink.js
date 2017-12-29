import { useFakeTimers } from 'sinon';
import should from 'should';
import TestUtils from 'react-addons-test-utils';
import * as ReactGA from '../../src';

export default function outboundLinkTests(spies) {
  /**
   * outboundLink()
   */

  describe('outboundLink()', function () {
    it('should record an outboundLink event', function (done) {
      ReactGA.initialize('foo');
      ReactGA.outboundLink({ label: 'Test Click' }, function () {
        // we need a reference to the function to compare in the
        // spies.ga.args test below
        const functionCalledBack = spies.ga.args[1][1].hitCallback;
        functionCalledBack.should.be.a.Function();

        spies.ga.args.should.eql([
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
      spies.warn.args.should.eql([[
        'hitCallback function is required'
      ]]);
    });

    it('should warn if label arg is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.outboundLink({ missing: 'labelarg' }, function () {
        // do nothing on callback
      });

      spies.warn.args.should.eql([[
        'args.label is required in outboundLink()'
      ]]);
    });

    it('should warn if hitCallback is missing', function () {
      ReactGA.initialize('foo');
      ReactGA.outboundLink({ label: 'Missing hitCallback' });
      spies.warn.args.should.eql([[
        'hitCallback function is required'
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
      this.clock = useFakeTimers();

      ReactGA.initialize('foo');
      const simulateGACallback = function () {
        done();
      };

      ReactGA.outboundLink({ label: 'http://www.google.com' }, simulateGACallback);

      this.clock.tick(125);
      const functionCalledBack = spies.ga.args[1][1].hitCallback;
      functionCalledBack();
      this.clock.restore();
    });

    it('should not fire hitCallback twice if ga responds after 250ms', function (done) {
      // use fake timers to simulate response time from GA
      this.clock = useFakeTimers();

      ReactGA.initialize('foo');
      const simulateGACallback = function () {
        done();
      };

      ReactGA.outboundLink({ label: 'http://www.google.com' }, simulateGACallback);

      this.clock.tick(260);
      const functionCalledBack = spies.ga.args[1][1].hitCallback;
      functionCalledBack();
      this.clock.restore();
    });

    it('should fire hitCallback if ga is not available after 250ms', function (done) {
      ReactGA.initialize('foo');
      const simulateGACallback = function () {
        done();
      };

      ReactGA.outboundLink({ label: 'http://www.google.com' }, simulateGACallback);

      const simulatedResponseTime = 275;
      setTimeout(function () {
        should.fail(
          `no response ${simulatedResponseTime} ms`,
          'response after 250 ms',
          'message',
          'operator'
        );
      }, simulatedResponseTime);
    });
  });

  /**
   * OutboundLink()
   */

  describe('OutboundLink()', function () {
    it('should create a React component <OutboundLink>', function () {
      ReactGA.initialize();

      const OutboundLinkComponent = ReactGA.OutboundLink;
      TestUtils.isElement(OutboundLinkComponent);
    });
  });
}

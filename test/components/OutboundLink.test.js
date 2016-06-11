var should = require('should');
var sinon = require('sinon');
var React = require('react');
var findDOMNode = require('react-dom').findDOMNode;
var TestUtils = require('react-addons-test-utils');
var jsdom = require('mocha-jsdom');

var OutboundLink = require('../../src/components/OutboundLink');

/**
 * <OutboundLink> React components
 */

describe('<OutboundLink> React component', function () {
  var renderedOutboundLink;
  var anchor;

  beforeEach(function () {
    var OutboundLinkComponent = React.createElement(OutboundLink, { eventLabel: '' });
    renderedOutboundLink = TestUtils.renderIntoDocument(OutboundLinkComponent);
  });

  afterEach(function () {
    renderedOutboundLink = null;
    anchor = null;
  });

  jsdom();

  it('should create an <a> DOM node', function () {
    anchor = TestUtils.findRenderedDOMComponentWithTag(renderedOutboundLink, 'a');
  });

  it('should have `href` set in the underlying <a> DOM node', function () {
    var destinationUrl = 'http://example.com/';
    renderedOutboundLink = TestUtils.renderIntoDocument(React.createElement(OutboundLink, {
      to: destinationUrl,
      eventLabel: ''
    }));
    anchor = TestUtils.findRenderedDOMComponentWithTag(renderedOutboundLink, 'a');
    findDOMNode(anchor).href.should.eql(destinationUrl);
  });

  it('should raise warning if ga module is not available', function () {
    sinon.stub(console, 'warn');
    var OutboundLinkComponent = React.createElement(OutboundLink, { eventLabel: '' });
    console.warn.callCount.should.eql(0);
    if (OutboundLink.origTrackLink) {
      // OutboundLink.trackLink has already been replaced in react-ga
      OutboundLinkComponent.type.trackLink = OutboundLink.origTrackLink;
    }

    OutboundLinkComponent.type.trackLink({}, function () {
    });

    console.warn.callCount.should.eql(1);
    console.warn.getCall(0).args.should.eql([
      'ga tracking not enabled'
    ]);
    console.warn.restore();
  });

  it('should not raise warning if ga module is available', function () {
    sinon.stub(console, 'warn');
    var OutboundLinkComponent = React.createElement(OutboundLink, { eventLabel: '' });
    console.warn.callCount.should.eql(0);
    OutboundLinkComponent.type.trackLink = require('../../src/index').outboundLink;
    OutboundLinkComponent.type.trackLink({}, function () {
    });

    console.warn.callCount.should.eql(0);
    console.warn.restore();
  });

  it('should call ga.outboundLink in its onClick event handler', function () {
    var fakeOutboundLinkFunc = sinon.spy();
    var fakeGA = { outboundLink: fakeOutboundLinkFunc };
    var OutboundLinkComponent = React.createElement(OutboundLink, { eventLabel: '' });
    OutboundLinkComponent.type.trackLink = fakeGA.outboundLink;
    renderedOutboundLink = TestUtils.renderIntoDocument(OutboundLinkComponent);
    anchor = TestUtils.findRenderedDOMComponentWithTag(renderedOutboundLink, 'a');
    fakeOutboundLinkFunc.callCount.should.eql(0);
    TestUtils.Simulate.click(anchor);
    fakeOutboundLinkFunc.callCount.should.eql(1);
  });

  it('should pass eventLabel prop to ga.outboundLink', function () {
    var fakeOutboundLinkFunc = sinon.spy();
    var fakeGA = { outboundLink: fakeOutboundLinkFunc };
    var OutboundLinkComponent = React.createElement(OutboundLink, { eventLabel: 'helloworld' });
    OutboundLinkComponent.type.trackLink = fakeGA.outboundLink;
    renderedOutboundLink = TestUtils.renderIntoDocument(OutboundLinkComponent);
    anchor = TestUtils.findRenderedDOMComponentWithTag(renderedOutboundLink, 'a');
    TestUtils.Simulate.click(anchor);
    fakeOutboundLinkFunc.getCall(0).args[0].label.should.eql('helloworld');
  });

  it('should call preserve onClick prop in onClick event handler', function () {
    var onComponentClick = sinon.spy();
    renderedOutboundLink = TestUtils.renderIntoDocument(React.createElement(OutboundLink, {
      onClick: onComponentClick,
      eventLabel: ''
    }));
    anchor = TestUtils.findRenderedDOMComponentWithTag(renderedOutboundLink, 'a');
    onComponentClick.callCount.should.eql(0);
    TestUtils.Simulate.click(anchor);
    onComponentClick.callCount.should.eql(1);
  });

});

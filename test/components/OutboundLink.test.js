var should = require('should');
var sinon = require('sinon');
var React = require('react/addons');
var jsdom = require('mocha-jsdom');
var TestUtils = React.addons.TestUtils;

var OutboundLink = require('../../src/components/OutboundLink');

/**
 * <OutboundLink> React components
 */

describe('<OutboundLink> React component', function() {
  var renderedOutboundLink, anchor;

  beforeEach(function() {
    renderedOutboundLink = TestUtils.renderIntoDocument( React.createElement(OutboundLink, {eventLabel: ''}) );
  });

  afterEach(function() {
    renderedOutboundLink = null;
    anchor = null;
  });

  jsdom();

  it('should create an <a> DOM node', function() {
    anchor = TestUtils.findRenderedDOMComponentWithTag(renderedOutboundLink,'a');
  });

  it('should have `href` set in the underlying <a> DOM node', function() {
    var destinationUrl = "http://example.com/";
    renderedOutboundLink = TestUtils.renderIntoDocument( React.createElement(OutboundLink, {
      to: destinationUrl,
      eventLabel: ''
    }));
    anchor = TestUtils.findRenderedDOMComponentWithTag(renderedOutboundLink,'a');
    anchor.getDOMNode().href.should.equal(destinationUrl);
  });

  it('should raise warning if ga module is not available', function() {
    sinon.stub(console,'warn');
    var OutboundLinkComponent = React.createElement(OutboundLink, {eventLabel: ''});
    console.warn.callCount.should.equal(0);
    OutboundLinkComponent.type.trackLink();
    console.warn.callCount.should.equal(1);
    console.warn.getCall(0).args.should.eql([
      'ga tracking not enabled'
    ]);
    console.warn.restore();
  });

  it('should not raise warning if ga module is available', function() {
    sinon.stub(console,'warn');
    var OutboundLinkComponent = React.createElement(OutboundLink, {eventLabel: ''});
    console.warn.callCount.should.equal(0);
    OutboundLinkComponent.type.trackLink = require('../../src/index').outboundLink;
    console.warn.callCount.should.equal(0);
    console.warn.restore();
  });

  it('should call ga.outboundLink in its onClick event handler', function() {
    var fakeOutboundLinkFunc = sinon.spy();
    var fakeGA = { outboundLink: fakeOutboundLinkFunc };
    var OutboundLinkComponent = React.createElement(OutboundLink, {eventLabel: ''});
    OutboundLinkComponent.type.trackLink = fakeGA.outboundLink;
    renderedOutboundLink = TestUtils.renderIntoDocument(OutboundLinkComponent);
    anchor = TestUtils.findRenderedDOMComponentWithTag(renderedOutboundLink,'a');
    fakeOutboundLinkFunc.callCount.should.eql(0);
    TestUtils.Simulate.click(anchor);
    fakeOutboundLinkFunc.callCount.should.eql(1);
  });

  it('should pass eventLabel prop to ga.outboundLink', function() {
    var fakeOutboundLinkFunc = sinon.spy();
    var fakeGA = { outboundLink: fakeOutboundLinkFunc };
    var OutboundLinkComponent = React.createElement(OutboundLink, {eventLabel: "helloworld"});
    OutboundLinkComponent.type.trackLink = fakeGA.outboundLink;
    renderedOutboundLink = TestUtils.renderIntoDocument(OutboundLinkComponent);
    anchor = TestUtils.findRenderedDOMComponentWithTag(renderedOutboundLink,'a');
    TestUtils.Simulate.click(anchor);
    fakeOutboundLinkFunc.getCall(0).args[0].label.should.equal('helloworld');
  });

  it('should call preserve onClick prop in onClick event handler', function() {
    var onComponentClick = sinon.spy();
    renderedOutboundLink = TestUtils.renderIntoDocument( React.createElement(OutboundLink, {
      onClick: onComponentClick,
      eventLabel: ''
    }));
    anchor = TestUtils.findRenderedDOMComponentWithTag(renderedOutboundLink,'a');
    onComponentClick.callCount.should.eql(0);
    TestUtils.Simulate.click(anchor);
    onComponentClick.callCount.should.eql(1);
  });

});

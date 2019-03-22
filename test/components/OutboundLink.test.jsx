import should from 'should';
import sinon from 'sinon';
import React from 'react';
import { shallow } from 'enzyme';

import OutboundLink, { __RewireAPI__ as RewireAPI } from '../../src/components/OutboundLink';
import { __RewireAPI__ as GARewireAPI } from '../../src/index';

/**
 * <OutboundLink> React components
 */

describe('<OutboundLink> React component', function () {
  let renderedOutboundLink;
  let warnSpy;

  beforeEach(function () {
    warnSpy = sinon.spy();
    RewireAPI.__Rewire__('warn', warnSpy);
    GARewireAPI.__Rewire__('warn', warnSpy);
    renderedOutboundLink = shallow(<OutboundLink eventLabel="" />);
  });

  afterEach(function () {
    renderedOutboundLink = null;
    RewireAPI.__ResetDependency__('warn');
    GARewireAPI.__ResetDependency__('warn');
  });

  it('should create an <a> DOM node', function () {
    renderedOutboundLink.type().should.eql('a');
  });

  it('should have `href` set in the underlying <a> DOM node', function () {
    const destinationUrl = 'http://example.com/';
    renderedOutboundLink = shallow(<OutboundLink to={destinationUrl} eventLabel="" />);
    renderedOutboundLink.prop('href').should.eql(destinationUrl);
  });

  it('should raise warning if ga module is not available', function () {
    const OutboundLinkComponent = React.createElement(OutboundLink, { eventLabel: '' });
    warnSpy.callCount.should.eql(0);
    if (OutboundLink.origTrackLink) {
      // OutboundLink.trackLink has already been replaced in react-ga
      OutboundLinkComponent.type.trackLink = OutboundLink.origTrackLink;
    }

    OutboundLinkComponent.type.trackLink({}, function () {
    });

    warnSpy.callCount.should.eql(1);
    warnSpy.getCall(0).args.should.eql([
      'ga tracking not enabled'
    ]);
  });

  it('should call ga.outboundLink in its onClick event handler', function () {
    const fakeOutboundLinkFunc = sinon.spy();
    const fakeGA = { outboundLink: fakeOutboundLinkFunc };
    const OutboundLinkComponent = React.createElement(OutboundLink, { eventLabel: '' });
    OutboundLinkComponent.type.trackLink = fakeGA.outboundLink;
    renderedOutboundLink = shallow(OutboundLinkComponent);
    fakeOutboundLinkFunc.callCount.should.eql(0);
    renderedOutboundLink.simulate('click', { preventDefault: () => {} });
    fakeOutboundLinkFunc.callCount.should.eql(1);
  });

  it('should pass eventLabel prop to ga.outboundLink', function () {
    const fakeOutboundLinkFunc = sinon.spy();
    const fakeGA = { outboundLink: fakeOutboundLinkFunc };
    const OutboundLinkComponent = React.createElement(OutboundLink, { eventLabel: 'helloworld' });
    OutboundLinkComponent.type.trackLink = fakeGA.outboundLink;
    renderedOutboundLink = shallow(OutboundLinkComponent);
    renderedOutboundLink.simulate('click', { preventDefault: () => {} });
    fakeOutboundLinkFunc.getCall(0).args[0].label.should.eql('helloworld');
  });

  it('should pass trackerNames prop to ga.outboundLink', function () {
    const fakeOutboundLinkFunc = sinon.spy();
    const fakeGA = { outboundLink: fakeOutboundLinkFunc };
    const props = { eventLabel: 'helloworld', trackerNames: ['tracker2'] };
    const OutboundLinkComponent = React.createElement(OutboundLink, props);
    OutboundLinkComponent.type.trackLink = fakeGA.outboundLink;
    renderedOutboundLink = shallow(OutboundLinkComponent);
    renderedOutboundLink.simulate('click', { preventDefault: () => {} });
    fakeOutboundLinkFunc.getCall(0).args[2].should.eql(['tracker2']);
  });

  it('should call preserve onClick prop in onClick event handler', function () {
    const onComponentClick = sinon.spy();
    renderedOutboundLink = shallow(<OutboundLink eventLabel="" onClick={onComponentClick} />);
    onComponentClick.callCount.should.eql(0);
    renderedOutboundLink.simulate('click', { preventDefault: () => {} });
    onComponentClick.callCount.should.eql(1);
  });

  it('should add rel=`noopener noreferrer` to a link if the target is _blank', function () {
    const destinationUrl = 'http://example.com/';
    renderedOutboundLink = shallow(<OutboundLink to={destinationUrl} eventLabel="" target="_blank" />);
    renderedOutboundLink.prop('rel').should.eql('noopener noreferrer');
  });
});

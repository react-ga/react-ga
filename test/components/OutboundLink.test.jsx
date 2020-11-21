import React from 'react';
import { shallow } from 'enzyme';

import OutboundLink from '../../src/components/OutboundLink';

jest.mock('../../src/utils/loadGA');

/**
 * <OutboundLink> React components
 */

describe('<OutboundLink> React component', () => {
  let renderedOutboundLink;
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(global.console, 'warn').mockImplementation(() => {});
    renderedOutboundLink = shallow(<OutboundLink eventLabel="" />);
  });

  afterEach(() => {
    renderedOutboundLink = null;
    jest.restoreAllMocks();
  });

  it('should create an <a> DOM node', () => {
    expect(renderedOutboundLink.type()).toEqual('a');
  });

  it('should have `href` set in the underlying <a> DOM node', () => {
    const destinationUrl = 'http://example.com/';
    renderedOutboundLink = shallow(
      <OutboundLink to={destinationUrl} eventLabel="" />
    );
    expect(renderedOutboundLink.prop('href')).toEqual(destinationUrl);
  });

  it('should raise warning if ga module is not available', () => {
    const OutboundLinkComponent = React.createElement(OutboundLink, {
      eventLabel: ''
    });
    expect(warnSpy).toHaveBeenCalledTimes(0);
    if (OutboundLink.origTrackLink) {
      // OutboundLink.trackLink has already been replaced in react-ga
      OutboundLinkComponent.type.trackLink = OutboundLink.origTrackLink;
    }

    OutboundLinkComponent.type.trackLink({}, () => {});

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      '[react-ga]',
      'ga tracking not enabled'
    );
  });

  it('should call ga.outboundLink in its onClick event handler', () => {
    const fakeOutboundLinkFunc = jest.fn();
    const fakeGA = { outboundLink: fakeOutboundLinkFunc };
    const OutboundLinkComponent = React.createElement(OutboundLink, {
      eventLabel: ''
    });
    OutboundLinkComponent.type.trackLink = fakeGA.outboundLink;
    renderedOutboundLink = shallow(OutboundLinkComponent);
    expect(fakeOutboundLinkFunc).toHaveBeenCalledTimes(0);
    renderedOutboundLink.simulate('click', { preventDefault: () => {} });
    expect(fakeOutboundLinkFunc).toHaveBeenCalledTimes(1);
  });

  it('should pass eventLabel prop to ga.outboundLink', () => {
    const fakeOutboundLinkFunc = jest.fn();
    const OutboundLinkComponent = React.createElement(OutboundLink, {
      eventLabel: 'helloworld'
    });
    OutboundLinkComponent.type.trackLink = fakeOutboundLinkFunc;
    renderedOutboundLink = shallow(OutboundLinkComponent);
    renderedOutboundLink.simulate('click', { preventDefault: () => {} });
    expect(fakeOutboundLinkFunc).toHaveBeenCalledWith(
      { label: 'helloworld' },
      expect.anything(),
      null
    );
  });

  it('should pass trackerNames prop to ga.outboundLink', () => {
    const fakeOutboundLinkFunc = jest.fn();
    const props = { eventLabel: 'helloworld', trackerNames: ['tracker2'] };
    const OutboundLinkComponent = React.createElement(OutboundLink, props);
    OutboundLinkComponent.type.trackLink = fakeOutboundLinkFunc;
    renderedOutboundLink = shallow(OutboundLinkComponent);
    renderedOutboundLink.simulate('click', { preventDefault: () => {} });
    expect(fakeOutboundLinkFunc).toHaveBeenCalledWith(
      { label: 'helloworld' },
      expect.anything(),
      ['tracker2']
    );
  });

  it('should call preserve onClick prop in onClick event handler', () => {
    const onComponentClick = jest.fn();
    renderedOutboundLink = shallow(
      <OutboundLink eventLabel="" onClick={onComponentClick} />
    );
    expect(onComponentClick).toHaveBeenCalledTimes(0);
    renderedOutboundLink.simulate('click', { preventDefault: () => {} });
    expect(onComponentClick).toHaveBeenCalledTimes(1);
  });

  it('should add rel=`noopener noreferrer` to a link if the target is _blank', () => {
    const destinationUrl = 'http://example.com/';
    renderedOutboundLink = shallow(
      <OutboundLink to={destinationUrl} eventLabel="" target="_blank" />
    );
    expect(renderedOutboundLink.prop('rel')).toEqual('noopener noreferrer');
  });

  it('should add custom rel tags if the target is _blank', () => {
    const destinationUrl = 'http://example.com/';
    renderedOutboundLink = shallow(
      <OutboundLink
        to={destinationUrl}
        eventLabel=""
        target="_blank"
        rel="nofollow"
      />
    );
    expect(renderedOutboundLink.prop('rel')).toEqual(
      'nofollow noopener noreferrer'
    );
  });
});

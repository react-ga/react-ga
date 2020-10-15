import React, { Component } from 'react';
import PropTypes from 'prop-types';

import warn from '../utils/console/warn';

const NEWTAB = '_blank';
const MIDDLECLICK = 1;

export default class OutboundLink extends Component {
  static trackLink = () => {
    warn('ga tracking not enabled');
  };

  handleClick = (event) => {
    const { target, eventLabel, to, onClick, trackerNames } = this.props;
    const eventMeta = { label: eventLabel };
    const sameTarget = target !== NEWTAB;
    const normalClick = !(
      event.ctrlKey ||
      event.shiftKey ||
      event.metaKey ||
      event.button === MIDDLECLICK
    );

    if (sameTarget && normalClick) {
      event.preventDefault();
      OutboundLink.trackLink(
        eventMeta,
        () => {
          window.location.href = to;
        },
        trackerNames
      );
    } else {
      OutboundLink.trackLink(eventMeta, () => {}, trackerNames);
    }

    if (onClick) {
      onClick(event);
    }
  };

  render() {
    const { to: href, target, ...oldProps } = this.props;
    const props = {
      ...oldProps,
      target,
      href,
      onClick: this.handleClick
    };

    if (target === NEWTAB) {
      props.rel = `${props.rel ? props.rel : ''} noopener noreferrer`.trim();
    }

    delete props.eventLabel;
    delete props.trackerNames;
    return React.createElement('a', props);
  }
}

OutboundLink.propTypes = {
  eventLabel: PropTypes.string.isRequired,
  target: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func,
  trackerNames: PropTypes.arrayOf(PropTypes.string)
};

OutboundLink.defaultProps = {
  target: null,
  to: null,
  onClick: null,
  trackerNames: null
};

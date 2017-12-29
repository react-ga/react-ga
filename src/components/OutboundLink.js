import React, { Component } from 'react';
import PropTypes from 'prop-types';

import warn from '../utils/console/warn';

const NEWTAB = '_blank';
const MIDDLECLICK = 1;

export default class OutboundLink extends Component {
  static propTypes = {
    eventLabel: PropTypes.string.isRequired,
    target: PropTypes.string,
    to: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {
    target: null,
    to: null,
    onClick: null
  };

  static trackLink = () => {
    warn('ga tracking not enabled');
  };

  handleClick = (event) => {
    const { target, eventLabel, to, onClick } = this.props;
    const eventMeta = { label: eventLabel };
    const sameTarget = target !== NEWTAB;
    const normalClick = !(event.ctrlKey || event.shiftKey || event.metaKey || event.button === MIDDLECLICK);

    if (sameTarget && normalClick) {
      event.preventDefault();
      OutboundLink.trackLink(eventMeta, () => {
        window.location.href = to;
      });
    } else {
      OutboundLink.trackLink(eventMeta, () => {});
    }

    if (onClick) {
      onClick(event);
    }
  };

  render() {
    const props = {
      ...this.props,
      href: this.props.to,
      onClick: this.handleClick
    };
    delete props.eventLabel;
    return React.createElement('a', props);
  }
}

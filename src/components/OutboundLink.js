var React = require('react');
var assign = require('object-assign');

var NEWTAB = '_blank';

var OutboundLink = React.createClass({
  displayName: 'OutboundLink',
  propTypes: {
    eventLabel: React.PropTypes.string.isRequired
  },
  statics: {
    trackLink: function () {
      console.warn('ga tracking not enabled');
    }
  },
  handleClick: function (e) {
    e.preventDefault();
    var props = this.props;
    var eventMeta = { label: props.eventLabel };
    OutboundLink.trackLink(eventMeta, function () {
      if (props.target === NEWTAB) {
        window.open(props.to, NEWTAB);
      } else {
        window.location.href = props.to;
      }
    });

    if (props.onClick) {
      props.onClick(e);
    }
  },

  render: function () {
    var props = assign({}, this.props, {
      href: this.props.to,
      onClick: this.handleClick
    });
    delete props.eventLabel;
    return React.createElement('a', props);
  }
});

module.exports = OutboundLink;

var React = require('react');
var CreateReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var assign = require('object-assign');

var NEWTAB = '_blank';

var OutboundLink = CreateReactClass({
  displayName: 'OutboundLink',
  propTypes: {
    eventLabel: PropTypes.string.isRequired
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

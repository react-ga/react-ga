var React = require('react');
var CreateReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var assign = require('object-assign');

var NEWTAB = '_blank';
var MIDDLECLICK = 1;

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
    var props = this.props;
    var eventMeta = { label: props.eventLabel };
    var sameTarget = props.target !== NEWTAB;
    var normalClick = !(e.ctrlKey || e.shiftKey || e.metaKey || e.button === MIDDLECLICK);

    if (sameTarget && normalClick) {
      e.preventDefault();
      OutboundLink.trackLink(eventMeta, function () {
        window.location.href = props.to;
      });
    } else {
      OutboundLink.trackLink(eventMeta, function () {});
    }

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

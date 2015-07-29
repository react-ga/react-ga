var React = require('react');
var assign = require('react/lib/Object.assign');

var OutboundLink = React.createClass({
  displayName: 'OutboundLink',
  statics: {
    trackLink: function() {
      console.warn("ga tracking not enabled");
    }
  },
  handleClick: function (e) {
    e.preventDefault();
    var props = this.props;
    OutboundLink.trackLink(props.args, function () {
      if ( props.target === '_blank' ) {
        window.open(props.to, '_blank');
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
    return React.createElement('a', props);
  }
});

module.exports = OutboundLink;
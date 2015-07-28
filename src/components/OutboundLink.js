var React = require('react');
var ga = require('../index');

console.log(ga); // this returns me an empty object :(

var OutboundLink = React.createClass({
  displayName: 'OutboundLink',
  propTypes: {
    to: React.PropTypes.string,
    // outboundlinkArgs: React.propTypes.object.isRequired
  },
  handleClick: function (event) {
    event.preventDefault();
    // ga.outboundLink(this.props.outboundlinkArgs, function () {
      console.log("im the callbackkkkkkk");
      window.location.href = this.props.to;
    // });
  },
  render: function () {
    var props = {
      href: this.props.to,
      onClick: this.handleClick
    };
    console.log(this.props);
    console.log("===== rendering <OutboundLink> =====");
    return React.createElement('a', props, 'hello world im the link text');
  }
});

module.exports = OutboundLink;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import UnboundOutboundLink from './components/OutboundLink';
import * as Defaults from './core';
export var initialize = Defaults.initialize;
export var ga = Defaults.ga;
export var set = Defaults.set;
export var send = Defaults.send;
export var pageview = Defaults.pageview;
export var modalview = Defaults.modalview;
export var timing = Defaults.timing;
export var event = Defaults.event;
export var exception = Defaults.exception;
export var plugin = Defaults.plugin;
export var outboundLink = Defaults.outboundLink;
export var testModeAPI = Defaults.testModeAPI;
UnboundOutboundLink.origTrackLink = UnboundOutboundLink.trackLink;
UnboundOutboundLink.trackLink = Defaults.outboundLink;
export var OutboundLink = UnboundOutboundLink;
export default _objectSpread({}, Defaults, {
  OutboundLink: OutboundLink
});
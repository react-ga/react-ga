function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
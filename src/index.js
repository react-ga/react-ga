import UnboundOutboundLink from './components/OutboundLink';
import * as Defaults from './core';

export const initialize = Defaults.initialize;
export const ga = Defaults.ga;
export const set = Defaults.set;
export const send = Defaults.send;
export const pageview = Defaults.pageview;
export const modalview = Defaults.modalview;
export const timing = Defaults.timing;
export const event = Defaults.event;
export const exception = Defaults.exception;
export const plugin = Defaults.plugin;
export const outboundLink = Defaults.outboundLink;
export const testModeAPI = Defaults.testModeAPI;

UnboundOutboundLink.origTrackLink = UnboundOutboundLink.trackLink;
UnboundOutboundLink.trackLink = Defaults.outboundLink;
export const OutboundLink = UnboundOutboundLink;

export default {
  ...Defaults,
  OutboundLink
};

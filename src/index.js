import UnboundOutboundLink from './components/OutboundLink';
import * as Defaults from './core';

export const { initialize } = Defaults;
export const { addTrackers } = Defaults;
export const { ga } = Defaults;
export const { set } = Defaults;
export const { send } = Defaults;
export const { pageview } = Defaults;
export const { modalview } = Defaults;
export const { timing } = Defaults;
export const { event } = Defaults;
export const { exception } = Defaults;
export const { plugin } = Defaults;
export const { outboundLink } = Defaults;
export const { testModeAPI } = Defaults;

UnboundOutboundLink.origTrackLink = UnboundOutboundLink.trackLink;
UnboundOutboundLink.trackLink = Defaults.outboundLink;
export const OutboundLink = UnboundOutboundLink;

export default {
  ...Defaults,
  OutboundLink
};

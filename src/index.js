import UnboundOutboundLink from './components/OutboundLink';
import * as Defaults from './noreact';

UnboundOutboundLink.origTrackLink = UnboundOutboundLink.trackLink;
UnboundOutboundLink.trackLink = Defaults.outboundLink;
export const OutboundLink = UnboundOutboundLink;

export default {
  ...Defaults,
  OutboundLink
};

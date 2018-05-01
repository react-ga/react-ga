import UnboundOutboundLink from './components/OutboundLink';
import * as Defaults from './noreact';

UnboundOutboundLink.origTrackLink = UnboundOutboundLink.trackLink;
UnboundOutboundLink.trackLink = outboundLink;
export const OutboundLink = UnboundOutboundLink;

export default {
    ...Defaults,
    OutboundLink
};

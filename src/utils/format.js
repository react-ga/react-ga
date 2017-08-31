import mightBeEmail from './mightBeEmail';
import toTitleCase from './toTitleCase';
import warn from './console/warn';

const redacted = 'REDACTED (Potential Email Address)';

export default function format(s, titleCase) {
  if (mightBeEmail(s)) {
    warn('This arg looks like an email address, redacting.');
    return redacted;
  }

  if (titleCase) {
    return toTitleCase(s);
  }

  return s;
}

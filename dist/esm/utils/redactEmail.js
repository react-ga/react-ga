import warn from './console/warn';
import mightBeEmail from './mightBeEmail';
var redacted = 'REDACTED (Potential Email Address)';
export default function redactEmail(string) {
  if (mightBeEmail(string)) {
    warn('This arg looks like an email address, redacting.');
    return redacted;
  }

  return string;
}
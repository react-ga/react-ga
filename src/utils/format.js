var mightBeEmail = require('./mightBeEmail');
var toTitleCase = require('./toTitleCase');
var warn = require('./console/warn');

var _redacted = 'REDACTED (Potential Email Address)';

function format(s) {
  if (mightBeEmail(s)) {
    warn('This arg looks like an email address, redacting.');
    s = _redacted;
    return s;
  }

  s = toTitleCase(s);
  return s;
}

module.exports = format;

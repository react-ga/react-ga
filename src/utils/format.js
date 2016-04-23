var mightBeEmail = require('./mightBeEmail');
var toTitleCase = require('./toTitleCase');
var warn = require('./console/warn');

var _redacted = 'REDACTED (Potential Email Address)';

function format(s, titleCase) {
  if (mightBeEmail(s)) {
    warn('This arg looks like an email address, redacting.');
    return _redacted;
  }

  if (titleCase) {
    return toTitleCase(s);
  }

  return s;
}

module.exports = format;

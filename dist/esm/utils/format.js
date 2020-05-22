import redactEmail from './redactEmail';
import toTitleCase from './toTitleCase';
export default function format() {
  var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var titleCase = arguments.length > 1 ? arguments[1] : undefined;
  var redactingEmail = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var _str = s || '';

  if (titleCase) {
    _str = toTitleCase(s);
  }

  if (redactingEmail) {
    _str = redactEmail(_str);
  }

  return _str;
}
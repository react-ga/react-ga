import redactEmail from './redactEmail';
import toTitleCase from './toTitleCase';

export default function format(
  s = '',
  titleCase = false,
  redactingEmail = true
) {
  let _str = s || '';

  if (titleCase) {
    _str = toTitleCase(s);
  }

  if (redactingEmail) {
    _str = redactEmail(_str);
  }

  return _str;
}

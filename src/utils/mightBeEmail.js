// See if s could be an email address. We don't want to send personal data like email.
// https://support.google.com/analytics/answer/2795983?hl=en
export default function mightBeEmail(s) {
  // There's no point trying to validate rfc822 fully, just look for ...@...
  return (/[^@]+@[^@]+/).test(s);
}

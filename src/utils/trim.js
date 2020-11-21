// GA strings need to have leading/trailing whitespace trimmed, and not all
// browsers have String.prototoype.trim().

export default function trim(s) {
  return s && s.toString().replace(/^\s+|\s+$/g, '');
}

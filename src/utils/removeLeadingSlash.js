function removeLeadingSlash(s) {
  if (s.substring(0, 1) === '/') {
    s = s.substring(1);
  }

  return s;
}

module.exports = removeLeadingSlash;

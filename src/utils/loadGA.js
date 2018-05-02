export default function (options) {
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/
  /* eslint-disable */
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
      (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    /**
     * Check if there is no script tag found(possible with test framework such as Jest) then add the GA script to root element
     */
    if (m) {
      m.parentNode.insertBefore(a, m);
    } else {
      s.documentElement.appendChild(a);
    }
})(window, document, 'script', options && options.gaAddress ? options.gaAddress : 'https://www.google-analytics.com/analytics.js', 'ga');
  /* eslint-enable */
}

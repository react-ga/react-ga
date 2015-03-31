/**
 * React Google Analytics Module
 *
 * @package react-ga
 * @author  Adam Lofting <adam@mozillafoundation.org>
 *          Atul Varma <atul@mozillafoundation.org>
 */

/**
 * Utilities
 */

var _redacted = 'REDACTED (Potential Email Address)';
var _debug = false;

function warn (s) {
  console.warn('[react-ga]', s);
}

function log (s) {
  console.info('[react-ga]', s);
}

// GA strings need to have leading/trailing whitespace trimmed, and not all
// browsers have String.prototoype.trim().
function trim(s) {
  return s.replace(/^\s+|\s+$/g, '');
}

/**
 * To Title Case 2.1 - http://individed.com/code/to-title-case/
 * Copyright 2008-2013 David Gouch. Licensed under the MIT License.
 * https://github.com/gouch/to-title-case
 */
function toTitleCase(s){
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
  s = trim(s);

  return s.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
    if (index > 0 &&
        index + match.length !== title.length &&
        match.search(smallWords) > -1 &&
        title.charAt(index - 2) !== ":" &&
        (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
        title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }

    if (match.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
}

// See if s could be an email address. We don't want to send personal data like email.
function mightBeEmail(s) {
  // There's no point trying to validate rfc822 fully, just look for ...@...
  return (/[^@]+@[^@]+/).test(s);
}

function format(s) {
  if(mightBeEmail(s)) {
    warn("This arg looks like an email address, redacting.");
    s = _redacted;
    return s;
  }
  s = toTitleCase(s);
  return s;
}

module.exports = {
  initialize: function(gaTrackingID, options) {
    if (!gaTrackingID) {
      warn('gaTrackingID is required in initialize()');
      return;
    }

    if (options) {
      if (options.debug && options.debug === true) {
        _debug = true;
      }
    }

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/
    /* jshint ignore:start */
    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
          m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script',
       '//www.google-analytics.com/analytics.js', 'ga');
    /* jshint ignore:end */

    ga('create', gaTrackingID, 'auto');
  },

  /**
   * pageview:
   * Basic GA pageview tracking
   * @param  {String} path - the current page page e.g. '/about'
   */
  pageview: function (path) {
    if (!path) {
      warn('path is required in .pageview(path)');
      return;
    }

    if (typeof ga === 'function') {
      path = trim(path);
      ga('send', 'pageview', path);

      if (_debug) {
        log('called ga(\'send\', \'pageview\', path);');
        log('with path: ' + path);
      }
    }
  },

  /**
   * modalview:
   * a proxy to basic GA pageview tracking to consistently track
   * modal views that are an equivalent UX to a traditional pageview
   * @param  {String} modalName e.g. 'add-or-edit-club'
   */
  modalview: function (modalName) {
    if (!modalName) {
      warn('modalName is required in .modalview(modalName)');
      return;
    }

    if (typeof ga === 'function') {
      modalName = trim(modalName);
      var path = '/modal/' + modalName;
      ga('send', 'pageview', path);

      if (_debug) {
        log('called ga(\'send\', \'pageview\', path);');
        log('with path: ' + path);
      }
    }
  },

  /**
   * event:
   * GA event tracking
   * @param args.category {String} required
   * @param args.action {String} required
   * @param args.label {String} optional
   * @param args.value {Int} optional
   * @param args.nonInteraction {Int} 1 = true, 0 = false
   */
  event: function (args) {
    if (typeof ga === 'function') {

      // Simple Validation
      if (!args.category || !args.action) {
        warn('args.category AND args.action are required');
        return;
      }

      // Required Fields
      var fieldObject = {
        'hitType': 'event',
        'eventCategory': format(args.category),
        'eventAction': format(args.action)
      };

      // Optional Fields
      if (args.eventLabel) {
        fieldObject.eventLabel = format(args.label);
      }

      if (args.eventValue) {
        if(typeof args.eventValue !== 'number') {
          warn('Expected `args.eventValue` arg to be a Number.');
        } else {
          fieldObject.eventValue = args.value;
        }
      }

      if (args.nonInteraction) {
        if(typeof nonInteraction !== 'boolean') {
          warn('Expected `args.nonInteraction` arg to be a Boolean.');
        } else {
          fieldObject.nonInteraction = args.nonInteraction;
        }
      }

      // Send to GA
      ga('send', fieldObject);

      if (_debug) {
        log('called ga(\'send\', fieldObject);');
        log('with fieldObject: ' + JSON.stringify(fieldObject));
      }
    }
  }
};


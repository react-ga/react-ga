(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ReactGA = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* eslint-disable no-unused-vars */
'use strict';
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],2:[function(require,module,exports){
(function (global){
var React = (typeof window !== "undefined" ? window['React'] : typeof global !== "undefined" ? global['React'] : null);
var assign = require('object-assign');

var NEWTAB = '_blank';

var OutboundLink = React.createClass({
  displayName: 'OutboundLink',
  propTypes: {
    eventLabel: React.PropTypes.string.isRequired
  },
  statics: {
    trackLink: function () {
      console.warn('ga tracking not enabled');
    }
  },
  handleClick: function (e) {
    e.preventDefault();
    var props = this.props;
    var eventMeta = { label: props.eventLabel };
    OutboundLink.trackLink(eventMeta, function () {
      if (props.target === NEWTAB) {
        window.open(props.to, NEWTAB);
      } else {
        window.location.href = props.to;
      }
    });

    if (props.onClick) {
      props.onClick(e);
    }
  },

  render: function () {
    var props = assign({}, this.props, {
      href: this.props.to,
      onClick: this.handleClick
    });
    delete props.eventLabel;
    return React.createElement('a', props);
  }
});

module.exports = OutboundLink;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"object-assign":1}],3:[function(require,module,exports){
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
var format = require('./utils/format');
var removeLeadingSlash = require('./utils/removeLeadingSlash');
var trim = require('./utils/trim');

var warn = require('./utils/console/warn');
var log = require('./utils/console/log');

var _debug = false;
var _titleCase = true;

var _format = function (s) {
  return format(s, _titleCase);
};

var ReactGA = {
  initialize: function (gaTrackingID, options) {
    if (!gaTrackingID) {
      warn('gaTrackingID is required in initialize()');
      return;
    }

    if (options) {
      if (options.debug && options.debug === true) {
        _debug = true;
      }

      if (options.titleCase === false) {
        _titleCase = false;
      }
    }

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/
    // jscs:disable
    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
          m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
    // jscs:enable

    if (options && options.gaOptions) {
      ga('create', gaTrackingID, options.gaOptions);
    } else {
      ga('create', gaTrackingID, 'auto');
    }
  },

  /**
   * ga:
   * Returns the original GA object.
   */
  ga: function () {
    if (arguments.length > 0) {
      ga.apply(this, arguments);
      if (_debug) {
        log('called ga(\'arguments\');');
        log('with arguments: ' + JSON.stringify([].slice.apply(arguments)));
      }

      return;
    }

    return ga;
  },

  /**
   * set:
   * GA tracker set method
   * @param {Object} fieldsObject - a field/value pair or a group of field/value pairs on the tracker
   */
  set: function (fieldsObject) {
    if (typeof ga === 'function') {
      if (!fieldsObject) {
        warn('`fieldsObject` is required in .set()');
        return;
      }

      if (typeof fieldsObject !== 'object') {
        warn('Expected `fieldsObject` arg to be an Object');
        return;
      }

      if (Object.keys(fieldsObject).length === 0) {
        warn('empty `fieldsObject` given to .set()');
      }

      ga('set', fieldsObject);

      if (_debug) {
        log('called ga(\'set\', fieldsObject);');
        log('with fieldsObject: ' + JSON.stringify(fieldsObject));
      }
    }
  },

  /**
   * send:
   * Clone of the low level `ga.send` method
   * WARNING: No validations will be applied to this
   * @param  {Object} fieldObject - field object for tracking different analytics
   */
  send: function (fieldObject) {
    if (typeof ga === 'function') {
      ga('send', fieldObject);

      if (_debug) {
        log('called ga(\'send\', fieldObject);');
        log('with fieldObject: ' + JSON.stringify(fieldObject));
      }
    }
  },

  /**
   * pageview:
   * Basic GA pageview tracking
   * @param  {String} path - the current page page e.g. '/about'
   */
  pageview: function (path) {
    if (!path) {
      warn('path is required in .pageview()');
      return;
    }

    path = trim(path);
    if (path === '') {
      warn('path cannot be an empty string in .pageview()');
      return;
    }

    if (typeof ga === 'function') {
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

    modalName = trim(modalName);
    modalName = removeLeadingSlash(modalName);

    if (modalName === '') {
      warn('modalName cannot be an empty string or a single / in .modalview()');
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
   * timing:
   * GA timing
   * @param args.category {String} required
   * @param args.variable {String} required
   * @param args.value  {Int}  required
   * @param args.label  {String} required
   */
  timing: function (args) {
    if (typeof ga === 'function') {
      if (!args || !args.category || !args.variable
          || !args.value || typeof args.value !== 'number') {
        warn('args.category, args.variable ' +
              'AND args.value are required in timing() ' +
              'AND args.value has to be a number');
        return;
      }

      //Required Fields
      var fieldObject = {
        hitType: 'timing',
        timingCategory: _format(args.category),
        timingVar: _format(args.variable),
        timingValue: args.value
      };

      if (args.label) {
        fieldObject.timingLabel = _format(args.label);
      }

      this.send(fieldObject);
    }
  },

  /**
   * event:
   * GA event tracking
   * @param args.category {String} required
   * @param args.action {String} required
   * @param args.label {String} optional
   * @param args.value {Int} optional
   * @param args.nonInteraction {boolean} optional
   */
  event: function (args) {
    if (typeof ga === 'function') {

      // Simple Validation
      if (!args || !args.category || !args.action) {
        warn('args.category AND args.action are required in event()');
        return;
      }

      // Required Fields
      var fieldObject = {
        hitType: 'event',
        eventCategory: _format(args.category),
        eventAction: _format(args.action)
      };

      // Optional Fields
      if (args.label) {
        fieldObject.eventLabel = _format(args.label);
      }

      if (args.value) {
        if (typeof args.value !== 'number') {
          warn('Expected `args.value` arg to be a Number.');
        } else {
          fieldObject.eventValue = args.value;
        }
      }

      if (args.nonInteraction) {
        if (typeof args.nonInteraction !== 'boolean') {
          warn('`args.nonInteraction` must be a boolean.');
        } else {
          fieldObject.nonInteraction = args.nonInteraction;
        }
      }

      if (args.transport) {
        if (typeof args.transport !== 'string') {
          warn('`args.transport` must be a string.');
        } else {
          if (['beacon', 'xhr', 'image'].indexOf(args.transport) === -1) {
            warn('`args.transport` must be either one of these values: `beacon`, `xhr` or `image`');
          }

          fieldObject.transport = args.transport;
        }
      }

      // Send to GA
      this.send(fieldObject);
    }
  },

  /**
   * exception:
   * GA exception tracking
   * @param args.description {String} optional
   * @param args.fatal {boolean} optional
   */
  exception: function (args) {
    if (typeof ga === 'function') {

      // Required Fields
      var fieldObject = {
        hitType: 'exception'
      };

      // Optional Fields
      if (args.description) {
        fieldObject.exDescription = _format(args.description);
      }

      if (typeof args.fatal !== 'undefined') {
        if (typeof args.fatal !== 'boolean') {
          warn('`args.fatal` must be a boolean.');
        } else {
          fieldObject.exFatal = args.fatal;
        }
      }

      // Send to GA
      this.send(fieldObject);
    }
  },

  plugin: {
    /**
     * require:
     * GA requires a plugin
     * @param name {String} e.g. 'ecommerce' or 'myplugin'
     * @param options {Object} optional e.g {path: '/log', debug: true}
     */
    require: function (name, options) {
      if (typeof ga === 'function') {

        // Required Fields
        if (!name) {
          warn('`name` is required in .require()');
          return;
        }

        name = trim(name);
        if (name === '') {
          warn('`name` cannot be an empty string in .require()');
          return;
        }

        // Optional Fields
        if (options) {
          if (typeof options !== 'object') {
            warn('Expected `options` arg to be an Object');
            return;
          }

          if (Object.keys(options).length === 0) {
            warn('Empty `options` given to .require()');
          }

          ga('require', name, options);

          if (_debug) {
            log('called ga(\'require\', \'' + name + '\', ' + JSON.stringify(options) + ');');
          }

          return;
        } else {
          ga('require', name);

          if (_debug) {
            log('called ga(\'require\', \'' + name + '\');');
          }

          return;
        }
      }
    },

    /**
     * execute:
     * GA execute action for plugin
     * Takes variable number of arguments
     * @param pluginName {String} e.g. 'ecommerce' or 'myplugin'
     * @param action {String} e.g. 'addItem' or 'myCustomAction'
     * @param actionType {String} optional e.g. 'detail'
     * @param payload {Object} optional e.g { id: '1x5e', name : 'My product to track' }
     */
    execute: function () {
      var args = Array.prototype.slice.call(arguments);

      var pluginName = args[0];
      var action = args[1];
      var payload;
      var actionType;

      if (args.length === 3) {
        payload = args[2];
      } else {
        actionType = args[2];
        payload = args[3];
      }

      if (typeof ga === 'function') {
        if (typeof pluginName !== 'string') {
          warn('Expected `pluginName` arg to be a String.');
        } else if (typeof action !== 'string') {
          warn('Expected `action` arg to be a String.');
        } else {
          var command = pluginName + ':' + action;
          payload = payload || null;
          if (actionType && payload) {
            ga(command, actionType, payload);
            if (_debug) {
              log('called ga(\'' + command + '\');');
              log('actionType: "' + actionType + '" with payload: ' + JSON.stringify(payload));
            }
          } else if (payload) {
            ga(command, payload);
            if (_debug) {
              log('called ga(\'' + command + '\');');
              log('with payload: ' + JSON.stringify(payload));
            }
          } else {
            ga(command);
            if (_debug) {
              log('called ga(\'' + command + '\');');
            }

          }
        }
      }
    }
  },

  /**
   * outboundLink:
   * GA outboundLink tracking
   * @param args.label {String} e.g. url, or 'Create an Account'
   * @param {function} hitCallback - Called after processing a hit.
   */
  outboundLink: function (args, hitCallback) {
    if (typeof hitCallback !== 'function') {
      warn('hitCallback function is required');
      return;
    }

    if (typeof ga === 'function') {

      // Simple Validation
      if (!args || !args.label) {
        warn('args.label is required in outboundLink()');
        return;
      }

      // Required Fields
      var fieldObject = {
        hitType: 'event',
        eventCategory: 'Outbound',
        eventAction: 'Click',
        eventLabel: _format(args.label)
      };

      var safetyCallbackCalled = false;
      var safetyCallback = function () {

        // This prevents a delayed response from GA
        // causing hitCallback from being fired twice
        safetyCallbackCalled = true;

        hitCallback();
      };

      // Using a timeout to ensure the execution of critical application code
      // in the case when the GA server might be down
      // or an ad blocker prevents sending the data

      // register safety net timeout:
      var t = setTimeout(safetyCallback, 250);

      var clearableCallbackForGA = function () {
        clearTimeout(t);
        if (!safetyCallbackCalled) {
          hitCallback();
        }
      };

      fieldObject.hitCallback = clearableCallbackForGA;

      // Send to GA
      this.send(fieldObject);
    } else {
      // if ga is not defined, return the callback so the application
      // continues to work as expected
      setTimeout(hitCallback, 0);
    }
  }
};

var OutboundLink = require('./components/OutboundLink');
OutboundLink.origTrackLink = OutboundLink.trackLink;
OutboundLink.trackLink = ReactGA.outboundLink.bind(ReactGA);
ReactGA.OutboundLink = OutboundLink;

module.exports = ReactGA;

},{"./components/OutboundLink":2,"./utils/console/log":4,"./utils/console/warn":5,"./utils/format":6,"./utils/removeLeadingSlash":8,"./utils/trim":10}],4:[function(require,module,exports){
function log(s) {
  console.info('[react-ga]', s);
}

module.exports = log;

},{}],5:[function(require,module,exports){
function warn(s) {
  console.warn('[react-ga]', s);
}

module.exports = warn;

},{}],6:[function(require,module,exports){
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

},{"./console/warn":5,"./mightBeEmail":7,"./toTitleCase":9}],7:[function(require,module,exports){
// See if s could be an email address. We don't want to send personal data like email.
// https://support.google.com/analytics/answer/2795983?hl=en
function mightBeEmail(s) {
  // There's no point trying to validate rfc822 fully, just look for ...@...
  return (/[^@]+@[^@]+/).test(s);
}

module.exports = mightBeEmail;

},{}],8:[function(require,module,exports){
function removeLeadingSlash(s) {
  if (s.substring(0, 1) === '/') {
    s = s.substring(1);
  }

  return s;
}

module.exports = removeLeadingSlash;

},{}],9:[function(require,module,exports){
/**
 * To Title Case 2.1 - http://individed.com/code/to-title-case/
 * Copyright 2008-2013 David Gouch. Licensed under the MIT License.
 * https://github.com/gouch/to-title-case
 */

var trim = require('./trim');

function toTitleCase(s) {
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;
  s = trim(s);

  return s.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
    if (index > 0 &&
        index + match.length !== title.length &&
        match.search(smallWords) > -1 &&
        title.charAt(index - 2) !== ':' &&
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

module.exports = toTitleCase;

},{"./trim":10}],10:[function(require,module,exports){
// GA strings need to have leading/trailing whitespace trimmed, and not all
// browsers have String.prototoype.trim().

function trim(s) {
  return s.replace(/^\s+|\s+$/g, '');
}

module.exports = trim;

},{}]},{},[3])(3)
});
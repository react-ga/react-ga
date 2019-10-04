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
import format from './utils/format';
import removeLeadingSlash from './utils/removeLeadingSlash';
import trim from './utils/trim';
import loadGA from './utils/loadGA';

import warn from './utils/console/warn';
import log from './utils/console/log';
import TestModeAPI from './utils/testModeAPI';

const _isNotBrowser = typeof window === 'undefined' || typeof document === 'undefined';

let _debug = false;
let _titleCase = true;
let _testMode = false;
let _alwaysSendToDefaultTracker = true;

const internalGa = (...args) => {
  if (_testMode) return TestModeAPI.ga(...args);
  if (_isNotBrowser) return false;
  if (!window.ga) return warn('ReactGA.initialize must be called first or GoogleAnalytics should be loaded manually');
  return window.ga(...args);
};

function _format(s) {
  return format(s, _titleCase);
}

function _gaCommand(trackerNames, ...args) {
  const command = args[0];
  if (typeof internalGa === 'function') {
    if (typeof command !== 'string') {
      warn('ga command must be a string');
      return;
    }

    if (_alwaysSendToDefaultTracker || !Array.isArray(trackerNames)) internalGa(...args);
    if (Array.isArray(trackerNames)) {
      trackerNames.forEach((name) => {
        internalGa(...[`${name}.${command}`].concat(args.slice(1)));
      });
    }
  }
}

function _initialize(gaTrackingID, options) {
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

    if (options.useExistingGa) {
      return;
    }
  }

  if (options && options.gaOptions) {
    internalGa('create', gaTrackingID, options.gaOptions);
  } else {
    internalGa('create', gaTrackingID, 'auto');
  }
}


export function initialize(configsOrTrackingId, options) {
  if (options && options.testMode === true) {
    _testMode = true;
  } else {
    if (_isNotBrowser) {
      return false;
    }

    if (!options || options.standardImplementation !== true) loadGA(options);
  }

  _alwaysSendToDefaultTracker = (options && typeof options.alwaysSendToDefaultTracker === 'boolean') ?
    options.alwaysSendToDefaultTracker : true;

  if (Array.isArray(configsOrTrackingId)) {
    configsOrTrackingId.forEach((config) => {
      if (typeof config !== 'object') {
        warn('All configs must be an object');
        return;
      }
      _initialize(config.trackingId, config);
    });
  } else {
    _initialize(configsOrTrackingId, options);
  }
  return true;
}

/**
 * ga:
 * Returns the original GA object.
 */
export function ga(...args) {
  if (args.length > 0) {
    internalGa(...args);
    if (_debug) {
      log('called ga(\'arguments\');');
      log(`with arguments: ${JSON.stringify(args)}`);
    }
  }

  return window.ga;
}

/**
 * set:
 * GA tracker set method
 * @param {Object} fieldsObject - a field/value pair or a group of field/value pairs on the tracker
 * @param {Array} trackerNames - (optional) a list of extra trackers to run the command on
 */
export function set(fieldsObject, trackerNames) {
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

  _gaCommand(trackerNames, 'set', fieldsObject);

  if (_debug) {
    log('called ga(\'set\', fieldsObject);');
    log(`with fieldsObject: ${JSON.stringify(fieldsObject)}`);
  }
}

/**
 * send:
 * Clone of the low level `ga.send` method
 * WARNING: No validations will be applied to this
 * @param  {Object} fieldObject - field object for tracking different analytics
 * @param  {Array} trackerNames - trackers to send the command to
 * @param {Array} trackerNames - (optional) a list of extra trackers to run the command on
 */
export function send(fieldObject, trackerNames) {
  _gaCommand(trackerNames, 'send', fieldObject);
  if (_debug) {
    log('called ga(\'send\', fieldObject);');
    log(`with fieldObject: ${JSON.stringify(fieldObject)}`);
    log(`with trackers: ${JSON.stringify(trackerNames)}`);
  }
}

/**
 * pageview:
 * Basic GA pageview tracking
 * @param  {String} path - the current page page e.g. '/about'
 * @param {Array} trackerNames - (optional) a list of extra trackers to run the command on
 * @param {String} title - (optional) the page title e. g. 'My Website'
 */
export function pageview(rawPath, trackerNames, title) {
  if (!rawPath) {
    warn('path is required in .pageview()');
    return;
  }

  const path = trim(rawPath);
  if (path === '') {
    warn('path cannot be an empty string in .pageview()');
    return;
  }

  const extraFields = {};
  if (title) {
    extraFields.title = title;
  }

  if (typeof ga === 'function') {
    _gaCommand(trackerNames, 'send', {
      hitType: 'pageview',
      page: path,
      ...extraFields
    });

    if (_debug) {
      log('called ga(\'send\', \'pageview\', path);');
      let extraLog = '';
      if (title) {
        extraLog = ` and title: ${title}`;
      }
      log(`with path: ${path}${extraLog}`);
    }
  }
}

/**
 * modalview:
 * a proxy to basic GA pageview tracking to consistently track
 * modal views that are an equivalent UX to a traditional pageview
 * @param  {String} modalName e.g. 'add-or-edit-club'
 * @param {Array} trackerNames - (optional) a list of extra trackers to run the command on
 */
export function modalview(rawModalName, trackerNames) {
  if (!rawModalName) {
    warn('modalName is required in .modalview(modalName)');
    return;
  }

  const modalName = removeLeadingSlash(trim(rawModalName));

  if (modalName === '') {
    warn('modalName cannot be an empty string or a single / in .modalview()');
    return;
  }

  if (typeof ga === 'function') {
    const path = `/modal/${modalName}`;
    _gaCommand(trackerNames, 'send', 'pageview', path);

    if (_debug) {
      log('called ga(\'send\', \'pageview\', path);');
      log(`with path: ${path}`);
    }
  }
}

/**
 * timing:
 * GA timing
 * @param args.category {String} required
 * @param args.variable {String} required
 * @param args.value  {Int}  required
 * @param args.label  {String} required
 * @param {Array} trackerNames - (optional) a list of extra trackers to run the command on
 */
export function timing({
  category,
  variable,
  value,
  label
} = {}, trackerNames) {
  if (typeof ga === 'function') {
    if (!category || !variable || !value || typeof value !== 'number') {
      warn('args.category, args.variable ' +
        'AND args.value are required in timing() ' +
        'AND args.value has to be a number');
      return;
    }

    // Required Fields
    const fieldObject = {
      hitType: 'timing',
      timingCategory: _format(category),
      timingVar: _format(variable),
      timingValue: value
    };

    if (label) {
      fieldObject.timingLabel = _format(label);
    }

    send(fieldObject, trackerNames);
  }
}

/**
 * event:
 * GA event tracking
 * @param args.category {String} required
 * @param args.action {String} required
 * @param args.label {String} optional
 * @param args.value {Int} optional
 * @param args.nonInteraction {boolean} optional
 * @param args.transport {string} optional
 * @param {Array} trackerNames - (optional) a list of extra trackers to run the command on
 */
export function event({
  category,
  action,
  label,
  value,
  nonInteraction,
  transport,
  ...args
} = {}, trackerNames) {
  if (typeof ga === 'function') {
    // Simple Validation
    if (!category || !action) {
      warn('args.category AND args.action are required in event()');
      return;
    }

    // Required Fields
    const fieldObject = {
      hitType: 'event',
      eventCategory: _format(category),
      eventAction: _format(action)
    };

    // Optional Fields
    if (label) {
      fieldObject.eventLabel = _format(label);
    }

    if (typeof value !== 'undefined') {
      if (typeof value !== 'number') {
        warn('Expected `args.value` arg to be a Number.');
      } else {
        fieldObject.eventValue = value;
      }
    }

    if (typeof nonInteraction !== 'undefined') {
      if (typeof nonInteraction !== 'boolean') {
        warn('`args.nonInteraction` must be a boolean.');
      } else {
        fieldObject.nonInteraction = nonInteraction;
      }
    }

    if (typeof transport !== 'undefined') {
      if (typeof transport !== 'string') {
        warn('`args.transport` must be a string.');
      } else {
        if (['beacon', 'xhr', 'image'].indexOf(transport) === -1) {
          warn('`args.transport` must be either one of these values: `beacon`, `xhr` or `image`');
        }

        fieldObject.transport = transport;
      }
    }

    Object.keys(args)
      .filter(key => key.substr(0, 'dimension'.length) === 'dimension')
      .forEach((key) => {
        fieldObject[key] = args[key];
      });

    Object.keys(args)
      .filter(key => key.substr(0, 'metric'.length) === 'metric')
      .forEach((key) => {
        fieldObject[key] = args[key];
      });

    // Send to GA
    send(fieldObject, trackerNames);
  }
}

/**
 * exception:
 * GA exception tracking
 * @param args.description {String} optional
 * @param args.fatal {boolean} optional
 * @param {Array} trackerNames - (optional) a list of extra trackers to run the command on
 */
export function exception({
  description,
  fatal
}, trackerNames) {
  if (typeof ga === 'function') {
    // Required Fields
    const fieldObject = {
      hitType: 'exception'
    };

    // Optional Fields
    if (description) {
      fieldObject.exDescription = _format(description);
    }

    if (typeof fatal !== 'undefined') {
      if (typeof fatal !== 'boolean') {
        warn('`args.fatal` must be a boolean.');
      } else {
        fieldObject.exFatal = fatal;
      }
    }

    // Send to GA
    send(fieldObject, trackerNames);
  }
}

export const plugin = {
  /**
   * require:
   * GA requires a plugin
   * @param name {String} e.g. 'ecommerce' or 'myplugin'
   * @param options {Object} optional e.g {path: '/log', debug: true}
   * @param trackerName {String} optional e.g 'trackerName'
   */
  require: (rawName, options, trackerName) => {
    if (typeof ga === 'function') {
      // Required Fields
      if (!rawName) {
        warn('`name` is required in .require()');
        return;
      }

      const name = trim(rawName);
      if (name === '') {
        warn('`name` cannot be an empty string in .require()');
        return;
      }
      const requireString = trackerName ? `${trackerName}.require` : 'require';
      // Optional Fields
      if (options) {
        if (typeof options !== 'object') {
          warn('Expected `options` arg to be an Object');
          return;
        }

        if (Object.keys(options).length === 0) {
          warn('Empty `options` given to .require()');
        }

        ga(requireString, name, options);

        if (_debug) {
          log(`called ga('require', '${name}', ${JSON.stringify(options)}`);
        }
      } else {
        ga(requireString, name);

        if (_debug) {
          log(`called ga('require', '${name}');`);
        }
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
  execute: (pluginName, action, ...args) => {
    let payload;
    let actionType;

    if (args.length === 1) {
      payload = args[0];
    } else {
      actionType = args[0];
      payload = args[1];
    }

    if (typeof ga === 'function') {
      if (typeof pluginName !== 'string') {
        warn('Expected `pluginName` arg to be a String.');
      } else if (typeof action !== 'string') {
        warn('Expected `action` arg to be a String.');
      } else {
        const command = `${pluginName}:${action}`;
        payload = payload || null;
        if (actionType && payload) {
          ga(command, actionType, payload);
          if (_debug) {
            log(`called ga('${command}');`);
            log(`actionType: "${actionType}" with payload: ${JSON.stringify(payload)}`);
          }
        } else if (payload) {
          ga(command, payload);
          if (_debug) {
            log(`called ga('${command}');`);
            log(`with payload: ${JSON.stringify(payload)}`);
          }
        } else {
          ga(command);
          if (_debug) {
            log(`called ga('${command}');`);
          }
        }
      }
    }
  }
};

/**
 * outboundLink:
 * GA outboundLink tracking
 * @param args.label {String} e.g. url, or 'Create an Account'
 * @param {function} hitCallback - Called after processing a hit.
 */
export function outboundLink(args, hitCallback, trackerNames) {
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
    const fieldObject = {
      hitType: 'event',
      eventCategory: 'Outbound',
      eventAction: 'Click',
      eventLabel: _format(args.label)
    };

    let safetyCallbackCalled = false;
    const safetyCallback = () => {
      // This prevents a delayed response from GA
      // causing hitCallback from being fired twice
      safetyCallbackCalled = true;

      hitCallback();
    };

    // Using a timeout to ensure the execution of critical application code
    // in the case when the GA server might be down
    // or an ad blocker prevents sending the data

    // register safety net timeout:
    const t = setTimeout(safetyCallback, 250);

    const clearableCallbackForGA = () => {
      clearTimeout(t);
      if (!safetyCallbackCalled) {
        hitCallback();
      }
    };

    fieldObject.hitCallback = clearableCallbackForGA;

    // Send to GA
    send(fieldObject, trackerNames);
  } else {
    // if ga is not defined, return the callback so the application
    // continues to work as expected
    setTimeout(hitCallback, 0);
  }
}

export const testModeAPI = TestModeAPI;

export default {
  initialize,
  ga,
  set,
  send,
  pageview,
  modalview,
  timing,
  event,
  exception,
  plugin,
  outboundLink,
  testModeAPI: TestModeAPI
};

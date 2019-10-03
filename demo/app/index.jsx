import React, { useState } from 'react';
import ReactGA from '../../src';

import Router from './Router';

function asDisplayString(value) {
  if (typeof value === 'string') return `'${value}'`;
  return value.toString();
}

function renderConfigString(config, indent = '') {
  return [
    '{',
    ...Object.keys(config).map((key) => {
      if (config[key] === undefined || config[key] === null) return '';
      return `\t${key}: ${asDisplayString(config[key])}`;
    }).filter(value => value),
    '}'
  ].reduce(
    (result, element, index, array) => {
      return `${result}${indent}${element}${index < array.length - 1 ? '\n' : ''}`;
    },
    ''
  );
}

const DEFAULT_CONFIG = {
  trackingId: '',
  debug: true,
  gaOptions: {
    cookieDomain: 'none'
  }
};

const App = () => {
  const [reactGaInitialised, setReactGaInitialised] = useState(false);
  const [configs, setConfigs] = useState([DEFAULT_CONFIG]);

  const filteredConfigs = () => {
    return configs.filter(({ trackingId: id }) => id);
  };

  const initReactGA = (event) => {
    event.preventDefault();
    if (filteredConfigs().length === 0) {
      return;
    }
    ReactGA.initialize(configs);
    // Send initial test view
    ReactGA.pageview('test-init-pageview');
    setReactGaInitialised(true);
  };

  const addConfig = () => {
    setConfigs([...configs, DEFAULT_CONFIG]);
  };

  const updateConfig = (configIndex, key, type, event) => {
    const config = configs[configIndex];
    let value;
    if (type === 'checkbox') {
      value = !config[key];
    } else {
      value = event.target.value;
    }
    const newConfig = {
      ...config,
      [key]: value
    };
    setConfigs([
      ...configs.slice(0, configIndex),
      newConfig,
      configs.slice(configIndex + 1)
    ]
    );
  };

  const renderConfigs = () => {
    const filteredConfig = filteredConfigs();
    if (filteredConfig.length === 0) return '';
    if (filteredConfig.length === 1) {
      const { trackingId, ...options } = filteredConfig[0];
      return `'${trackingId}'${Object.values(options).filter(val => val).length ? `, ${JSON.stringify(options)}` : ''}`;
    }
    return `[\n${
      filteredConfig.reduce((result, config, index, array) => {
        const configString = renderConfigString(config, '\t');
        return `${result}${result ? '\n' : ''}${configString}${index < array.length - 1 ? ',' : ''}`;
      }, '')
    }\n]`;
  };

  if (reactGaInitialised) {
    return (
      <div>
        <h4>App is Initialised. Refresh page to reset.</h4>
        <Router />
      </div>
    );
  }
  let initializationDebug = (
    <pre>
      ReactGA.initialize({renderConfigs()});
    </pre>
  );
  if (filteredConfigs().length === 0) {
    initializationDebug = <p>No Valid Configs set.</p>;
  }
  return (
    <form onSubmit={initReactGA}>
      <p>Input your configs below:</p>
      {configs.map(({ trackingId, debug }, index) => (
        <div key={index}>
          <div>
              TrackingID:&nbsp;
            <input value={trackingId} onChange={event => updateConfig(index, 'trackingId', 'text', event)} />
              &nbsp;Debug&nbsp;
            <input
              type="checkbox"
              checked={debug || false}
              onChange={event => updateConfig(index, 'debug', 'checkbox', event)}
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={addConfig}>Add Config</button>
      <button type="submit" disabled={configs.length < 1}>
        {configs.length < 1 ? 'Add Configs first' : 'Run the initialize function as below'}
      </button>
      {initializationDebug}
    </form>
  );
};

export { App as default };

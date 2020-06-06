import React, { PureComponent } from 'react';
import ReactGA from '../../src';

import Router from './Router';

function asDisplayString(value) {
  if (typeof value === 'string') return `'${value}'`;
  return value.toString();
}

function renderConfigString(config, indent = '') {
  return [
    '{',
    ...Object.keys(config)
      .map((key) => {
        if (config[key] === undefined || config[key] === null) return '';
        return `\t${key}: ${asDisplayString(config[key])}`;
      })
      .filter((value) => value),
    '}'
  ].reduce((result, element, index, array) => {
    return `${result}${indent}${element}${
      index < array.length - 1 ? '\n' : ''
    }`;
  }, '');
}

const DEFAULT_CONFIG = {
  trackingId: '',
  debug: true,
  gaOptions: {
    cookieDomain: 'none'
  }
};

export default class App extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      reactGaInitialised: false,
      configs: [DEFAULT_CONFIG]
    };
  }

  filteredConfigs = () => {
    const { configs } = this.state;
    return configs.filter(({ trackingId: id }) => id);
  };

  initReactGA = (event) => {
    event.preventDefault();
    if (this.filteredConfigs().length === 0) {
      return;
    }
    const { configs } = this.state;
    ReactGA.initialize(configs);
    // Send initial test view
    ReactGA.pageview('test-init-pageview');
    this.setState({ reactGaInitialised: true });
  };

  addConfig = () => {
    const { configs } = this.state;
    this.setState({
      configs: [configs, DEFAULT_CONFIG]
    });
  };

  updateConfig = (configIndex, key, type, event) => {
    const { configs } = this.state;
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
    this.setState({
      configs: [
        ...configs.slice(0, configIndex),
        newConfig,
        ...configs.slice(configIndex + 1)
      ]
    });
  };

  renderConfigs = () => {
    const configs = this.filteredConfigs();
    if (configs.length === 0) return '';
    if (configs.length === 1) {
      const { trackingId, ...options } = configs[0];
      return `'${trackingId}'${
        Object.values(options).filter((val) => val).length
          ? `, ${JSON.stringify(options)}`
          : ''
      }`;
    }
    return `[\n${configs.reduce((result, config, index, array) => {
      const configString = renderConfigString(config, '\t');
      return `${result}${result ? '\n' : ''}${configString}${
        index < array.length - 1 ? ',' : ''
      }`;
    }, '')}\n]`;
  };

  render() {
    const { configs, reactGaInitialised } = this.state;
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
        ReactGA.initialize(
        {this.renderConfigs()}
        );
      </pre>
    );
    if (this.filteredConfigs().length === 0) {
      initializationDebug = <p>No Valid Configs set.</p>;
    }
    return (
      <form onSubmit={this.initReactGA}>
        <p>Input your configs below:</p>
        {configs.map(({ trackingId, debug }, index) => (
          <div key={index}>
            <div>
              TrackingID:&nbsp;
              <input
                value={trackingId}
                onChange={this.updateConfig.bind(
                  this,
                  index,
                  'trackingId',
                  'text'
                )}
              />
              &nbsp;Debug&nbsp;
              <input
                type="checkbox"
                checked={debug || false}
                onChange={this.updateConfig.bind(
                  this,
                  index,
                  'debug',
                  'checkbox'
                )}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={this.addConfig}>
          Add Config
        </button>
        <button type="submit" disabled={configs.length < 1}>
          {configs.length < 1
            ? 'Add Configs first'
            : 'Run the initialize function as below'}
        </button>
        {initializationDebug}
      </form>
    );
  }
}

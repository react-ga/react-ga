import React, { PureComponent } from 'react';
import ReactGA from '../../src';

export default class Events extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      category: '',
      action: '',
      label: ''
    };
  }

  setValue = (key, event) => {
    this.setState({
      [key]: event.target.value
    });
  };

  sendEvent = (event) => {
    event.preventDefault();
    ReactGA.event(this.state);
    this.setState({
      category: '',
      action: '',
      label: ''
    });
  };

  render() {
    const { category, action, label } = this.state;
    return (
      <form onSubmit={this.sendEvent}>
        <h2>Events</h2>
        <p>Enter in details below to trigger an ReactGA.event call</p>
        <div>
          category{' '}
          <input
            value={category}
            onChange={this.setValue.bind(this, 'category')}
          />
        </div>
        <div>
          action{' '}
          <input value={action} onChange={this.setValue.bind(this, 'action')} />
        </div>
        <div>
          label{' '}
          <input value={label} onChange={this.setValue.bind(this, 'label')} />
        </div>
        <button type="submit">Send Event.</button>
      </form>
    );
  }
}

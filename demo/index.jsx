import React from 'react';
import { render } from 'react-dom';
import App from './app';

const container = document.createElement('div');
document.body.appendChild(container);

render(<App />, container);

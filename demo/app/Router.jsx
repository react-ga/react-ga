/**
 * Original Source code from https://reacttraining.com/react-router/web/example/basic
 */

import React from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import withTracker from './withTracker';

import Events from './Events';

function Topic({ match }) {
  return (
    <div>
      <h3>{match.params.topicId}</h3>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Topics({ match }) {
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link to={`${match.url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      <Route path={`${match.url}/:topicId`} component={withTracker(Topic)} />
      <Route
        exact
        path={match.url}
        render={() => <h3>Please select a topic.</h3>}
      />
    </div>
  );
}

function BasicExample() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
          <li>
            <Link to="/events">Events</Link>
          </li>
        </ul>

        <hr />

        <Route exact path="/" component={withTracker(Home)} />
        <Route path="/about" component={withTracker(About)} />
        <Route path="/topics" component={withTracker(Topics)} />
        <Route path="/events" component={withTracker(Events)} />
      </div>
    </Router>
  );
}

export default BasicExample;

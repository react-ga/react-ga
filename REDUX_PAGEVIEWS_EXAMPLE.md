### React Google Analytics Module Pageviews Example With Redux

```
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import ReactGA from 'react-ga';
ReactGA.initialize(config.gaTrackingId);

const gaTrackingMiddleware = store => next => action => {
  if (action.type === '@@router/LOCATION_CHANGE') {
    const nextPage = `${action.payload.pathname}${action.payload.search}`;
    trackPage(nextPage);
  }
   return next(action);
};

const trackPage = page => {
  ReactGA.pageview(page);
};

let myApp = combineReducers(reducers)
let store = createStore(
  myApp,
  applyMiddleware(
    gaTrackingMiddleware
  )
);
 ```
# react-ga
### React Google Analytics Module

[![Build Status](https://travis-ci.org/mozilla/react-ga.svg?branch=master)](https://travis-ci.org/mozilla/react-ga)

This is a JavaScript module that can be used to include Google Analytics tracking code in a website or app that uses [React](http://facebook.github.io/react/) for its front-end codebase. It does not currently use any React code internally, but has been written for use with a number of Mozilla Foundation websites that are using React, as a way to standardize our GA Instrumentation across projects.

It is designed to work with the latest version of Google Analytics, [Univeral Analytics](https://support.google.com/analytics/answer/2790010?hl%3Den). At this point, all Google Analytics projects are being upgraded to Universal Analytics, so this module will not support the older `ga.js` implementation.

This module is mildly opinionated in how we instrument tracking within our front-end code. Our API is slightly more verbose than the core Google Analytics library, in the hope that the code is easier to read and understand for our engineers. See examples below.

If you use `react-ga` too, we'd love your feedback. Feel free to file [issues, ideas and pull requests against this repo](https://github.com/mozilla/react-ga/issues).

## Installation
```bash
npm install react-ga
```

## Use

### Initializing GA  and Tracking Pageviews with `react-router`

```js
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;

...

var ga = require('react-ga');

...

exports.run = function(location, el) {
  ga.initialize(process.env.GA_TRACKING_ID);
  Router.run(routes, location, function(Handler, state) {
    ga.pageview(state.pathname);
    React.render(<Handler/>, el);
  });
};

```


### API

#### ga.initialize(gaTrackingID, options)

GA must be initialized using this function before any of the other tracking functions will record any data.

###### Example

```js
var options = { debug: true };
ga.initialize('UA-000000-01', options);
```

|Value|Notes|
|------|-----|
|gaTrackingID| `String`. GA Tracking ID like 'UA-000000-01'|
|options.debug| `Boolean`. Optional. If set to `true`, will output additional feedback to the console|

See example above for use with `react-router`.

#### ga.pageview(path)

###### Example

```js
ga.pageview('/about/contact-us');
```

|Value|Notes|
|------|-----|
|path|`String`. e.g. '/get-involved/other-ways-to-help'|

See example above for use with `react-router`.

#### ga.modalview(modalName)

A modal view is often an equivilent to a pageview in our UX, but without a change in URL that would record a standard GA pageview. For example, a 'contact us' modal may be accessible from any page in a site, even if we don't have a standalone 'contact us' page on it's own URL. In this scenario, the modalview should be recorded using this function.

###### Example

```js
ga.modalview('/about/contact-us');
```

|Value|Notes|
|------|-----|
|modalName|`String`. E.g. 'login', 'read-terms-and-conditions'|

#### ga.event(args)

Tracking in-page `event` interactions is key to understanding the use of any interactive web property. This is how we record user interactions that don't trigger a change in URL.

###### Examples

```js
ga.event( { category: 'User',
            action: 'Created an Account' } );

ga.event( { category: 'Social',
            action: 'Rated an App',
            value: 3 } );

ga.event( { category: 'Editing',
            action: 'Deleted Component',
            label: 'Game Widget' } );

ga.event( { category: 'Promotion',
            action: 'Displayed Promotional Widget',
            label: 'Homepage Thing',
            nonInteraction: true } );
```

|Value|Notes|
|------|-----|
|args.category|`String`. Required. A top level category for these events. E.g. 'User', 'Navigation', 'App Editing', etc|
|args.action|`String`. Required. A description of the behaviour. E.g. 'Clicked Delete', 'Added a component', 'Deleted account', etc.|
|args.label|`String`. Optional. More precise labelling of the related action. E.g. alongside the 'Added a component' action, we could add the name of a component as the label. E.g. 'Survey', 'Heading', 'Button', etc.|
|args.value|`Int`. Optional. A means of recording a numerical value against an event. E.g. a rating, a score, etc.|
|args.nonInteraction|`Boolean`. If an event is not triggered by a user interaction, but instead by our code (e.g. on page load, it should be flagged as a nonInteraction event to avoid skewing bounce rate data.|

#### ga.outboundLink(args, hitCallback)

Tracking links out to external URLs (including id.webmaker.org for oAuth2 login flow).

###### Examples

```js
ga.outboundLink( { label: 'Clicked Create an Account' },
                    function () {
                      console.log('redirect here');
                    } );
```

|Value|Notes|
|------|-----|
|args.label|`String`. Required. Description of where the outbound link points to. Either as a URL, or a string|
|hitCallback|`function`. The react-ga implementation accounts for the possibility that GA servers are down, or GA is blocked, by using a fallback 250ms timeout. See [notes in GA Dev Guide](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#hitCallback)|


#### ga.plugin.require(name)

Require GA plugins.

##### Example
```js
ga.plugin.require('ecommerce');
```


#### ga.plugin.execute(pluginName, action, payload)

Execute the `action` for the `pluginName` with the payload.

#### Example

```js
ga.plugin.execute('ecommerce', 'addTransaction', {
  'id': "jd38je31j",
  'revenue': "3.50"
});
```
---

## Development

### Prerequisites

* node.js
* npm
* `npm install --global gulp`

### To Test
```bash
npm test
```

### Submitting a PR

* Always work on a new branch
* Submit Pull Requests against `master`

1. Open a PR
1. Request code review
1. Complete code review with fixes
1. Merge the PR
1. Then, bump the version as below

The regenerated dist files should not be committed until the review has been R+'d and merged, since it's much easier to do the code review without the dist clutter getting in the way.

### To Ship (i.e bump the version number)

```bash
git pull...
gulp build
mversion patch
git add .
git commit...
git push...
npm publish
```

---

#### Acknowledgements

* Quite a lot of the code in this repo, came from [webmaker-analytics](https://github.com/mozilla/webmaker-analytics)

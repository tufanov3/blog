# Callback Router

Most routers map a URL to some UI. **Callback Router** is a little different;
instead of mapping URLs directly to the components that render the page, this
library is a tiny hook into the history API that lets you map URLs to callback
functions that can do pretty much whatever you want!

Perhaps you need to maintain a meaningful URL for one reason or another, but you
don't want `window.location` totally running the show in your Single-Page App.
Using Callback Router allows you to keep the URL as far away from application
state as you like.


## Install

[yarn][]:
```bash
yarn add callback-router
```

[npm][]:

```bash
npm install callback-router
```


## Usage

A basic route maps a `path` to a `callback`. The pathname is processed on router
initialization and on `popstate` events. When a route is matched, its `callback`
is invoked.

The pathname is _not_ necessarily processed for imperative history changes, such
as when using `history.pushState()` and `history.replaceState()`, but you can
enable that behavior per route using the `navigate` property.

Routes are evaluated in order of most- to least-specific, regardless of the registration order.

```js
import {
  ROUTE_CHANGE_INITIALIZE,
  registerRoutes,
} from 'callback-router';

// Register the routes
const {
  unregisterRoutes,
  evaluate,
} = registerRoutes({
  '/users': () => {
    console.log('Show me users');
  },
  '/users/:id': {
    callback: (params) => {
      console.log(`Show me user ${params.id}`);
    },
    last: true, // prevent '/users' route from firing
  },
});

// Evaluate the current URI
evaluate(
  document.location.pathname,
  window.history.state,
  ROUTE_CHANGE_INITIALIZE,
);

// Unregister the routes
unregisterRoutes();
```


## API

* [`registerRoutes(routes, callback)`](#registerRoutes)
* [`evaluate(pathname, state, type, routes)`](#evaluate)
* [`navigate(path, options)`](#navigate)

---

####  `registerRoutes`

Registers paths to their callbacks.

Returns functions to unregister the routes and evaluate a given path.

```js
const {
  unregisterRoutes,
  evaluate,
} = registerRoutes(routes, callback);
```

##### `routes` (`Object`)

Map of paths to route definitions or callbacks.
The path may contain named `:params` or `(.*)` wildcards.

Route definitions have the following properties:

###### `callback(params, type, pathname, state, path)`

Function invoked when the route is matched.

###### `exact` (`boolean`, defaults to `false`)

When set, this will not honor a partial match.
For example a URI `/user/123` would not match the route `/user`.

###### `last` (`boolean`, defaults to `true`)

When set, a match on this route will prevent subsequent lower-priority routes
from being evaluated.

###### `navigate` (`boolean`, defaults to `false`)

When set, this route will be evaluated for imperative navigation (`pushState`
and `replaceState`) whether or not navigation is forced.

###### `strict` (`boolean`, defaults to `false`)

When set, the trailing slash must be present or omitted exactly as the route is
defined. For example, a URI `/users` would not match the route `/users/`, or
vise-versa.

##### `callback(result)` (`Function`, optional)

Common callback invoked at the end of any matching route's callback.

---

#### `evaluate`

Determines which routes match the pathname and invokes their callbacks.

Returns the value returned from the callback of the highest-priority (first)
matching route.

```js
const result = evaluate(
  pathname,
  state,
  type,
  routes,
);
```

##### `pathname` (`string`, defaults to `document.location.pathname`)

URI to evaluate

##### `state` (`Object`, defaults to window.history.state)

Additional state data associated with the current history item.

##### `type` (`string`)

Navigation type used to differentiate between imperative navigation and browser navigation.

* `ROUTE_CHANGE_INITIALIZE`: Router was first registered
* `ROUTE_CHANGE_PUSH_STATE`: Imperative navigation (skips callback)
* `ROUTE_CHANGE_REPLACE_STATE`: Imperative navigation (skips callback)
* `ROUTE_CHANGE_POP_STATE`: Browser navigation (invokes callback)
* `ROUTE_CHANGE_FORCE_PUSH_STATE`: Imperative navigation (invokes callback)
* `ROUTE_CHANGE_FORCE_REPLACE_STATE`: Imperative navigation  (invokes callback)
* `ROUTE_CHANGE_UNKNOWN`: Unknown navigation type

##### `routes` (`Object`, defaults to all registered routes)

Map of paths to route definitions or callbacks.

---

#### `navigate`

Performs imperative navigation using `pushState` or `replaceState`.

This _only_ modifies history by default. **Routes are not evaluated** except
when the route was defined with `navigate` enabled or if the `force` option
enabled when navigating.

Returns the result of the callback if a route was evaluated.

```js
const result = navigate(path, {
  force,
  replaceState,
  state,
  title,
});
```

##### `path` (`string`)

Destination pathname.

##### `options.force` (`boolean`, defaults to `false`)

When set, this will evaluate non-`navigate` routes.

##### `options.replaceState` (`boolean`, defaults to `false`)

When set, this replaces the current history state instead of pushing an
additional state.

##### `options.state` (`Object`, defaults to `{}`)

Additional data associated with the state.

##### `options.title` (`string`, defaults to `document.title`)

Title of the history state.


### React and/or Redux Integration

* [`useCallbackRouter`](https://github.com/kmck/callback-router/tree/master/packages/react-use-callback-router)
  provides a hook interface for using Callback Router.

* [`reduxCallbackRouter`](https://github.com/kmck/callback-router/tree/master/packages/redux-callback-router)
  integrates Callback Router with the Redux state, allowing you to map the state
  to URLs and dispatch actions when navigating.

* [`useReduxCallbackRouter`](https://github.com/kmck/callback-router/tree/master/packages/react-use-redux-callback-router)
  provides a hook interface for using Redux Callback Router.


## License

ISC © [Keith McKnight](https://github.com/kmck)


[yarn]: https://yarnpkg.com/lang/en/docs/install
[npm]: https://docs.npmjs.com/cli/install

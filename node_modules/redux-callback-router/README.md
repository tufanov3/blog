# Redux Callback Router

This is the Redux flavor of [Callback Router], which allows you to keep the URL
synchronized with your Redux state In addition to generic callbacks, you can map
routes to action creators so that navigation will dispatch an action.


## Install

[yarn][]:
```bash
yarn add redux-callback-router
```

[npm][]:

```bash
npm install redux-callback-router
```


## Usage

```js
import {
  ROUTE_CHANGE_INITIALIZE,
  createCallbackRouterReducer,
  registerRoutes,
} from 'redux-callback-router';

import yourReducer from './reducer';

// Map the state to paths
function mapStateToPath(state, action, prevState) {
  if (state.id) {
    if (action.type === 'CHANGE_USER') {
      // Return a string for the pushState destination
      return `/users/${id}`;
    } else {
      // Return [string, options] to customize navigation
      return [`/users/${id}`, { replaceState: true }];
    }
  }
  // Otherwise, leave path unchanged
  return null;
}

// Wrap the router to update the path on state changes
const reducer = createCallbackRouterReducer(yourReducer, mapStateToPath);

// Use the wrapped reducer to create your Redux store
const store = createStore(reducer);

// Register the routes
const {
  unregisterRoutes,
  evaluate,
} = registerRoutes({
  '/users': {
    type: 'SHOW_USERS',
  },
  '/users/:id': {
    action: (params) => ({
      type: 'SHOW_USER',
      payload: {
        userId: params.id,
      },
    }),
    last: true, // prevent '/users' route from firing
  },
}, store.dispatch, store.getState);

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
* [`createCallbackRouterReducer(reducer, mapStateToPath, navigateInitialState)`](#createCallbackRouterReducer)

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

Returns `{ unregisterRoutes, evaluate }`.

##### `routes` (`Object`)

Map of paths to route definitions, actions creators, or actions.
The path may contain named `:params` or `(.*)` wildcards.

Route definitions have the following properties:

###### `action` (`Object`)

A Redux action that is dispatched when the route is matched.

###### `action(params, type, pathname, state, path, getState)`

Function that generates an action to be dispatched when the route is matched.

###### `callback(params, type, dispatch, getState, pathname, state, path)`

Function invoked when the route is matched.

This is an alternative to `action` for cases where a route needs to dispatch
multiple actions or have some other special behavior.

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

Performs imperative navigation.

By default, this _only_ modifies history using `pushState` or `replaceState`.
Routes without `navigate` enabled are _not_ evaluated unless the `force` option
is enabled!

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

---

####  `createCallbackRouterReducer`

Creates a wrapped reducer that can update the history based on the state.

```js
const wrappedReducer = createCallbackRouterReducer(
  reducer,
  mapStateToPath,
  navigateInitialState, // default: false
);
```

##### `reducer` (`Function`)

Reducer to connect to the Callback Router.

##### `mapStateToPath(state, action, prevState)`

Function that determines the URL from the state (and/or action).

The return value is used to determine whether and how `navigate` is invoked.
Return a string to push a new history state. Return an array with a string and
an object to specify the navigation `options`.

##### `navigateInitialState` (`boolean`, defaults to `false`)

The initial reducer call doesn't represent a state change, so navigation doesn't
typically make sense. Setting this will ignore that and attempt to navigate
after the initial reducer invocation.


## License

ISC © [Keith McKnight](https://github.com/kmck)


[yarn]: https://yarnpkg.com/lang/en/docs/install
[npm]: https://docs.npmjs.com/cli/install
[Callback Router]: https://github.com/kmck/callback-router/tree/master/packages/callback-router

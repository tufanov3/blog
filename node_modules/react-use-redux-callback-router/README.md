# useReduxCallbackRouter

Provides a React hook for using [Redux Callback Router].

## Install

[yarn][]:
```bash
yarn add react-use-redux-callback-router
```

[npm][]:

```bash
npm install react-use-redux-callback-router
```


## Usage

```js
import { useReduxCallbackRouter } from 'react-use-redux-callback-router';

const YourComponent = () => {
  const dispatch = useDispatch();
  const userId = useSelector(userIdSelector);

  const routes = useMemo(() => ({
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
  }), []);
  const [result, navigate] = useCallbackRouter(routes, true);

  const handleShowAllClick = useCallback(() => {
    dispatch({ type: 'SHOW_USERS' });
  }, [dispatch]);

  const handleShowRandomClick = useCallback(() => {
    dispatch({
      type: 'SHOW_USER',
      payload: {
        userId: 1 + Math.floor(Math.random() * 5),
      },
    });
  }, [dispatch]);

  return (
    <div>
      {userId == null ? (
        <p>All users</p>
      ) : (
        <p>User #{userId}</p>
      )}
      <button onClick={handleShowAllClick}>Show All</button>
      <button onClick={handleShowRandomClick}>Show Random</button>
    </div>
  );
};
```



## API

#### `useReduxCallbackRouter`

Registers paths to their callbacks and returns the most recent result and the
`evaluate` function for the given routes.

```js
const [result, evaluate] = useReduxCallbackRouter(routes, initialize);
```

###### Arguments

##### `routes` (`Object`)

Map of paths to route definitions, actions creators, or actions.
The path may contain named `:params` or `(.*)` wildcards.

##### `initialize` (`boolean`, defaults to `true`)

When set, the routes are evaluated on mount.

##### `callback(params, type, pathname, state, path)`

Function invoked when the route is matched.

###### Returns

##### `result`

The return value of the most recently evaluated callback for a matching route.

##### `evaluate` (`Function`)

Determines which routes match the pathname and invokes their callbacks.

**This does not evaluate all routes**, just the ones that were included when
calling the hook!


## License

ISC © [Keith McKnight](https://github.com/kmck)


[yarn]: https://yarnpkg.com/lang/en/docs/install
[npm]: https://docs.npmjs.com/cli/install
[Redux Callback Router]: https://github.com/kmck/callback-router/tree/master/packages/redux-callback-router

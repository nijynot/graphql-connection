# graphql-connection
> GraphQL Relay Connection helper library

GraphQL forward pagination arguments are equivalent to backwards pagination arguments. I.e. you can rewrite any backwards pagination arguments as forward paginatino arguments and still get the same result back. This is useful because you'll only need to support forward pagination on your backend, and bidirectional pagination will still work like intended.
The function `transformToForward` makes this possible.

Read more about [connections](https://facebook.github.io/relay/graphql/connections.htm).

## Install

```
$ yarn add graphql-connection
```
## Usage

Example:
```js
import {
  globalIdField,
  connectionDefinitions,
  getOffsetWithDefault,
  connectionArgs,
} from 'graphql-relay';
import {
  connectionFromArray,
  transformToForward,
} from 'graphql-connection';

...

export const groupType = new GraphQLObjectType({
  name: 'Group',
  fields: () => ({
    id: globalIdField(),
    users: {
      type: userConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async (obj, args) => {
        const { first, after } = transformToForward(args);
        const array = await db.getUsers({
          limit: first + 1,
          offset: getOffsetWithDefault(after, -1) + 1,
        });

        // Don't forget to pass the arguments returned from "transformToForward"
        return connectionFromArray(array, { first, after });
      },
    },
  }),
});
```

## API

### connectionFromArray(_array_, _args_)

Returns a connection from given array and forward pagination arguments.

`array`  
Type: `Array`  

`args`  
Type: `Object`  
Property: `first`, `after`  
Note: Accepts only forward pagination arguments.

`first`  
Type: `Number`

`after`  
Type: `String`

### transformToForward

A function that takes forward- and backward pagination arguments and returns only forward pagination arguments. Prioritizes forward pagination arguments.  
Returns `-1` as a cursor for `after` if it should not be in argument.

`args`  
Type: `Object`  
Property: `first`, `after`, `last`, `before`

`first`  
Type: `Number`

`after`  
Type: `String`  

`last`  
Type: `Number`

`before`  
Type: `String`  

## Related

- [graphql-relay-js](https://github.com/graphql/graphql-relay-js)
- [Relay Cursor Connections Specification](https://facebook.github.io/relay/graphql/connections.htm)

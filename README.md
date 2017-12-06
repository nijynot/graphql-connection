# graphql-connection
> GraphQL Connection library.

## Install

```
$ yarn add graphql-connection
```

## Usage

Example:
```js
import {
  connectionDefinitions,
  conncetionArgs,
  connectionFromArray,
} from 'graphql-connection';

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: globalIdField(),
  }),
});

export const userConnection = connectionDefinitions({
  name: 'UserConnection',
  type: userType,
});

export const groupType = new GraphQLObjectType({
  name: 'Group',
  fields: () => ({
    users: {
      type: userConnection,
      args: {
        ...connectionArgs,
      },
      resolve: async (obj, args) => {
        const array = await db.getUsers();
        const count = await db.getUserCount();
        return connectionFromArray({ array, args, count });
      },
    },
  }),
});
```

## API

### connectionDefinitions(_options_)

Returns configuration for the connection field.

`options`
Type: `Object`
Property: `name`, `type`

`name`
Type: `String`

`type`
Type: `GraphQLObjectType`

### connectionArgs

Object with property `limit` and `offset` that are required for the connection's `args` field.

`connectionArgs`
Type: `Object`
Property: `limit`, `offset`

`limit`
Type: `Number`

`offset`
Type: `Number`
Default: `0`

### connectionFromArray(_options_)

`options`
Type: `Object`
Property: `array`, `args`, `count`

`array`
Type: `Array`

`args`
Type: `Object`
Property: `limit`, `offset`
`args` is needed to set `true` or `false` for `hasNextPage` and `hasPreviousPage`.

`count`
Type: `Number`
The maximum amount of nodes that can be fetched.

## Related

- [graphql-relay-js](https://github.com/graphql/graphql-relay-js)
- [Connection](https://facebook.github.io/relay/docs/en/graphql-connections.html)

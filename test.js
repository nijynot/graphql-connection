const test = require('ava');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require('graphql');
const {
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
  pageInfoType,
} = require('./lib/index.js');

// test('define connection', t => {
//   t.deepEqual(
//     new GraphQLObjectType({
//       name: 'UserConnection',
//       fields: () => ({
//         edges: {
//           type: new GraphQLList(GraphQLString),
//         },
//         pageInfo: {
//           type: new GraphQLNonNull(pageInfoType),
//         },
//         count: {
//           type: GraphQLInt,
//         },
//       }),
//     }),
//     connectionDefinitions({ name: 'UserConnection', type: GraphQLString })
//   );
// });

test('check connection arguments', t => {
  t.deepEqual({
    limit: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    offset: {
      type: GraphQLInt,
      defaultValue: 0,
    },
  }, connectionArgs);
});

test('turn array into connection', t => {
  const array = [
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
  ];
  const args = {
    limit: 3,
    offset: 1,
  };
  const count = 10;
  const expected = {
    edges: [
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ],
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: true,
    },
    count: 10,
  }
  t.deepEqual(connectionFromArray({ array, args, count }), expected, 'cool');
});

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import initial from 'lodash/initial';
import isArray from 'lodash/isArray';

const pageInfoType = new GraphQLObjectType({
  name: 'PageInfo',
  fields: () => ({
    hasNextPage: {
      type: GraphQLBoolean,
    },
    hasPreviousPage: {
      type: GraphQLBoolean,
    },
  }),
});
exports.pageInfoType = pageInfoType;

exports.connectionDefinitions = ({ name, type }) => (
  new GraphQLObjectType({
    name,
    fields: () => ({
      edges: {
        type: new GraphQLList(type),
      },
      pageInfo: {
        type: new GraphQLNonNull(pageInfoType),
      },
      count: {
        type: GraphQLInt,
      },
    }),
  })
);

exports.connectionFromArray = ({ array, args, count }) => {
  const edges = (!isEmpty(array) && isArray(array)) ? array : [];
  const hasNextPage = (edges.length === args.limit + 1);
  const hasPreviousPage = (args.offset > 0);

  return {
    edges: (hasNextPage) ? initial(edges) : edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
    },
    count,
  };
};

exports.connectionArgs = {
  limit: {
    type: new GraphQLNonNull(GraphQLInt),
  },
  offset: {
    type: GraphQLInt,
    defaultValue: 0,
  },
};

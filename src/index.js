import { getOffsetWithDefault, offsetToCursor, cursorToOffset } from 'graphql-relay';

export function connectionFromArray(arraySlice, args) {
  const { first, after } = args;
  const afterOffset = getOffsetWithDefault(after, -1) + 1;

  if (typeof first === 'number') {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }
  }

  // If supplied slice is too large, trim it down before mapping over it.
  const slice = arraySlice.slice(
    0,
    first
  );

  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(afterOffset + index),
    node: value,
  }));

  const endOffset = Math.min(first - 1, arraySlice.length - 1);

  const firstEdge = edges[0];
  const lastEdge = edges[endOffset];

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: afterOffset > 0,
      hasNextPage: first < arraySlice.length,
    },
  };
}

export function transformToForward(args) {
  const { first, after, last, before } = args;

  if (typeof first === 'number' && first >= 0) {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }
    return { first, after };
  }

  if (typeof last === 'number' && typeof before === 'string') {
    if (last < 0) {
      throw new Error('Argument "last" must be a non-negative integer');
    }
    const afterOffset = Math.max(cursorToOffset(before) - last - 1, -1);
    return {
      first: Math.min(last, getOffsetWithDefault(before, 0)),
      after: offsetToCursor(afterOffset),
    };
  }

  return args;
}

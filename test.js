const test = require('ava');
const {
  connectionFromArray,
  transformToForward,
} = require('./lib/index.js');

test('turn backward into forward', t => {
  const args = {
    last: 5,
    before: 'YXJyYXljb25uZWN0aW9uOjg=',
  };
  const forward = transformToForward(args);
  t.deepEqual(forward, { first: 5, after: 'YXJyYXljb25uZWN0aW9uOjI=' });
});

test('turn backward into forward with no after', t => {
  const args = {
    last: 5,
    before: 'YXJyYXljb25uZWN0aW9uOjM=',
  };
  const forward = transformToForward(args);
  t.deepEqual(forward, { first: 3, after: 'YXJyYXljb25uZWN0aW9uOi0x' });
});

test('array into connection', t => {
  const forward = { first: 3, after: 'YXJyYXljb25uZWN0aW9uOjE=' };
  const data = [
    // { id: 'a' }
    // { id: 'b' }
    { id: 'c' },
    { id: 'd' },
    { id: 'e' },
    { id: 'f' },
  ];
  const connection = connectionFromArray(data, forward);
  const expected = {
    edges: [
      { node: { id: 'c' }, cursor: 'YXJyYXljb25uZWN0aW9uOjI=' },
      { node: { id: 'd' }, cursor: 'YXJyYXljb25uZWN0aW9uOjM=' },
      { node: { id: 'e' }, cursor: 'YXJyYXljb25uZWN0aW9uOjQ=' },
    ],
    pageInfo: {
      startCursor: 'YXJyYXljb25uZWN0aW9uOjI=',
      endCursor: 'YXJyYXljb25uZWN0aW9uOjQ=',
      hasNextPage: true,
      hasPreviousPage: true,
    },
  };
  t.deepEqual(connection, expected);
});

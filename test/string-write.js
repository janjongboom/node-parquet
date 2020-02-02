#!/usr/bin/env node

var parquet = require('..');

var schema = {string: {type: 'string'}};
var writer = new parquet.ParquetWriter(__dirname + '/test.parquet', schema, 'gzip');

export default (t) => {
  t.test('string-write', t => {
    t.equal(typeof writer, 'object');
    writer.write([
      [ Buffer.from('hello') ],
      [ 'world' ],
      [ '00001a8a-e405-4337-a3ec-07dc7431a9c5' ],
      [ Buffer.from('00001a8a-e405-4337-a3ec-07dc7431a9c5') ],
    ]);
    writer.close();
  });
};

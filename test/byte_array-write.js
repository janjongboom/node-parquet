#!/usr/bin/env node

var parquet = require('..');

var file = __dirname + '/test.parquet';
var schema = {ba: {type: 'byte_array'}};
var writer = new parquet.ParquetWriter(file, schema, 'gzip');

writer.write([
  [Buffer.from('hello')],
  ['world'],
  ['00001a8a-e405-4337-a3ec-07dc7431a9c5'],
  [Buffer.from('00001a8a-e405-4337-a3ec-07dc7431a9c5')],
]);
writer.close();

var reader = new parquet.ParquetReader(file);
var info = reader.info();
var rows = reader.rows(4);

export default (t) => {
  t.test('byte_array-write', t => {
      t.equal(info.rows, 4, 'read: correct number of rows in schema');
      t.equal(info.columns, 1, 'read: correct number of columns in schema');

      t.equal(rows[0][0], 'hello', 'read row 0: hello');
      t.equal(rows[1][0], 'world', 'read row 1: world');
  });
};

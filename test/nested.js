#!/usr/bin/env node

var parquet = require('..');

var schema = {
  id: {type: 'int64', optional: true},
  aggr: {type: 'list', repeated: true, schema: {
//    bag: {type: 'group', optional: true, schema: {
      ba: {type: 'byte_array', optional: true}
//    }},
  }},
};

export default (t) => {
  t.test('nested', t => {
    var writer = new parquet.ParquetWriter(__dirname + '/test.parquet', schema, 'gzip');

    t.equal(typeof writer, 'object');
    writer.write([
      [1, [Buffer.from('hello')]],
      [2, ['world']],
    //  [3, []],
      [4, ['00001a8a-e405-4337-a3ec-07dc7431a9c5']],
    ]);
    writer.close();
  });
};

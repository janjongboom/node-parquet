#!/usr/bin/env node

var parquet = require('../');

var schema = {int: {type: 'int32'}};
var writer = new parquet.ParquetWriter(__dirname + '/test.parquet', schema);

export default (t) => {
    t.test('int32-write', t => {
        t.equal(typeof writer, 'object');
        t.equal(writer.write([[1], [2], [3]]), 3);
        writer.close();
    });
};

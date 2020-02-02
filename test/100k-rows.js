#!/usr/bin/env node

var t = require('tap');
var parquet = require('../index.js');

var schema = {
    timestamp: {type: 'timestamp'},
    float1: {type: 'float'},
    float2: {type: 'float'}
};

var file = __dirname + '/test.parquet';
var writer = new parquet.ParquetWriter(file, schema);

console.log('created file');

console.time('writing rows');
let tx = 0;
for (let ix = 0; ix < 100; ix++) {
    let rows = [];
    for (let jx = 0; jx < 1000; jx++) {
        rows.push([ Date.now(), tx, tx * 2 ]);
        tx++;
    }
    writer.write(rows);
}
console.timeEnd('writing rows');

console.time('finalizing');
writer.close();
console.timeEnd('finalizing');

var reader = new parquet.ParquetReader(file);
var info = reader.info();
t.equal(info.rows, 100000, 'read: correct number of rows in schema');
t.equal(info.columns, 3, 'read: correct number of columns in schema');

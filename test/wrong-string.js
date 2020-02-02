#!/usr/bin/env node

var parquet = require('../');
var schema = { string: {type: 'byte_array'}, };

export default (t) => {
  t.test('wrong-string', t => {

    var f = new parquet.ParquetWriter(__dirname + '/t1.parquet', schema);

    var thrown = false;
    try {
      f.write([
        [ "hello" ],    // Ok
        [ [ 4 ] ]       // Fault
      ]);
    }
    catch (ex) {
      thrown = true;
    }

    t.equal(thrown, true);

    f.close();
  });
};

// Copyright 2017 Luca-SAS, licensed under the Apache License 2.0

'use strict';

const fs = require('fs');
const Path = require('path');

let parquet;

if (!process.env.PARQUET_SKIP_PREBUILT && fs.existsSync(Path.join(__dirname, 'build', 'Release', 'parquet.node'))) {
  parquet = require('../build/Release/parquet.node');
}
else {
  if (process.platform === 'darwin') {
    parquet = require('../release/mac/parquet.node');
  }
  else if (process.platform === 'linux') {
    try {
      parquet = require('../release/linux/parquet.node');
    }
    catch (ex) {
      if (ex.message && ex.message.indexOf('libboost_regex.so') > -1) {
        console.error('ERR: edge-impulse-parquet on Linux requires libboost_regex v1.62.0.');
        console.error('Install via (for example):')
        console.error('');
        console.error('wget https://sourceforge.net/projects/boost/files/boost/1.62.0/boost_1_62_0.tar.gz');
        console.error('tar -xzf boost_1_62_0.tar.gz');
        console.error('cd boost_1_62_0');
        console.error('./boostrap.sh --with-libraries=atomic,date_time,exception,filesystem,iostreams,locale,program_options,regex,signals,system,test,thread,timer,log');
        console.error('./b2');
        console.error('');
      }
      throw ex;
    }
  }
  else {
    throw new Error('No pre-built binaries for platform "' + process.platform + '"');
  }
}

module.exports = parquet;

parquet.ParquetReader.prototype.rows = function(nrows) {
  const info = this.info();
  nrows = nrows || info.rows;
  var i, j, col, e;

  if (!this._last) this._last = [];
  if (!this._count) this._count = [];
  if (this._remain === undefined) this._remain = info.rows;
  if (nrows > this._remain) nrows = this._remain;

  const rows = new Array(nrows);
  for (j = 0; j < info.columns; j++) {
    this._count[j] = 0;
  }
  for (i = 0; i < nrows; i++) {
    rows[i] = new Array(info.columns);
    col = rows[i];
    for (j = 0; j < info.columns; j++) {
      if (this._last[j]) {
        col[j] = [this._last[j][2]];
        while (true) {
          this._last[j] = this.read(j);
          this._count[j]++;
          if (!this._last[j] || this._last[j][1] === 0)
            break;
          col[j].push(this._last[j][2]);
        }
        continue;
      }
      col[j] = this.read(j);
      if (Array.isArray(col[j])) {
        this._last[j] = col[j];
        this._count[j]++;
        col[j] = [this._last[j][2]];
        while (true) {
          this._last[j] = this.read(j);
          this._count[j]++;
          if (!this._last[j] || this._last[j][1] === 0)
            break;
          col[j].push(this._last[j][2]);
        }
      }
    }
  }
  this._remain -= nrows;
  return rows;
};

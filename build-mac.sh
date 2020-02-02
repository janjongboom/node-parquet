#!/bin/bash
set -e

mkdir -p release/mac/
git submodule update --init --recursive

npm run prebuild-source

rm -rf release/mac/libboost_regex.a
cp ./build_deps/parquet-cpp/release/libparquet.a release/mac/
cp ./build_deps/parquet-cpp/release/libarrow.a release/mac/
cp ./build_deps/parquet-cpp/arrow_ep-prefix/src/arrow_ep-build/snappy_ep/src/snappy_ep-install/lib/libsnappy.a release/mac/
cp ./build_deps/parquet-cpp/arrow_ep-prefix/src/arrow_ep-build/brotli_ep-prefix/src/brotli_ep-build/libbrotlidec.a release/mac/
cp ./build_deps/parquet-cpp/arrow_ep-prefix/src/arrow_ep-build/brotli_ep-prefix/src/brotli_ep-build/libbrotlienc.a release/mac/
cp ./build_deps/parquet-cpp/arrow_ep-prefix/src/arrow_ep-build/brotli_ep-prefix/src/brotli_ep-build/libbrotlicommon.a release/mac/
cp ./build_deps/parquet-cpp/thrift_ep/src/thrift_ep-install/lib/libthrift.a release/mac/
cp /usr/local/lib/libboost_regex.a release/mac/libboost_regex.a

npm run build-source
cp build/Release/parquet.node release/mac/parquet.node

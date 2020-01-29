#!/bin/bash
set -e

docker built -t node-parquet .
docker run --rm -v $PWD/release/linux:/root/shared/ node-parquet

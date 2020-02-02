#!/bin/bash
set -e

docker build -t node-parquet .
docker run --rm -v $PWD/release/linux:/root/shared/ node-parquet

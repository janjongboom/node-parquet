FROM node:12

WORKDIR /home/node/app

# APT packages
RUN apt update && \
    apt install -y zip xxd apt-transport-https ca-certificates curl gnupg2 software-properties-common \
                   cmake libboost-dev libboost-all-dev libbison-dev flex g++-7


COPY .git ./.git
COPY .gitmodules ./
RUN git submodule update --init --recursive

COPY build_parquet-cpp.sh ./

RUN sh ./build_parquet-cpp.sh

RUN mkdir -p release/linux && \
    cp ./build_deps/parquet-cpp/release/libparquet.a release/linux/ && \
    cp ./build_deps/parquet-cpp/release/libarrow.a release/linux/ && \
    cp ./build_deps/parquet-cpp/arrow_ep-prefix/src/arrow_ep-build/snappy_ep/src/snappy_ep-install/lib/libsnappy.a release/linux/ && \
    cp ./build_deps/parquet-cpp/arrow_ep-prefix/src/arrow_ep-build/brotli_ep-prefix/src/brotli_ep-build/libbrotlidec.a release/linux/ && \
    cp ./build_deps/parquet-cpp/arrow_ep-prefix/src/arrow_ep-build/brotli_ep-prefix/src/brotli_ep-build/libbrotlienc.a release/linux/ && \
    cp ./build_deps/parquet-cpp/arrow_ep-prefix/src/arrow_ep-build/brotli_ep-prefix/src/brotli_ep-build/libbrotlicommon.a release/linux/ && \
    cp ./build_deps/parquet-cpp/thrift_ep/src/thrift_ep-install/lib/libthrift.a release/linux/

COPY . ./

COPY package*.json ./
RUN npm install
RUN npm run build-source

CMD cp release/linux/* /root/shared/ && cp build/Release/parquet.node /root/shared/parquet.node

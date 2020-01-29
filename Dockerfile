FROM node:12

WORKDIR /home/node/app

# APT packages
RUN apt update && \
    apt install -y zip xxd apt-transport-https ca-certificates curl gnupg2 software-properties-common \
                   cmake libboost-dev libboost-all-dev libbison-dev flex

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm install

CMD cp build/Release/parquet.node /root/shared/parquet.node

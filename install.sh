#!/bin/bash

# Update
sudo apt-get upgrade -y
sudo apt-get update -y

# Install mongo
sudo apt-get mongodb-server -y
/etc/init.d/mongodb start

# Setup mongo
mongo hackathon --eval "db.runCommand({create:'messages'});"
mongo hackathon --eval "db.messages.createIndex({ id: 1 }, {unique:true});"
mongo hackathon --eval "db.messages.dropIndex('_id_');" 

# Install node
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb

# Install server
cd ~
mkdir hackathon
cd hackathon
https://github.com/othke/iot_server.git

# update npm
cd iot_server
npm install
node cluster.js
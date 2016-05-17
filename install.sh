#!/bin/bash
sudo apt-get upgrade -y
sudo apt-get update -y

sudo apt-get mongodb-server -y
/etc/init.d/mongodb start

wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb

cd ~
mkdir hackathon
cd hackathon
git clone https://github.com/othke/redis_server.git
cd redis_server
git checkout -b mongodb origin/mongodb

npm install
node cluster.js
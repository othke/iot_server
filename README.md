###################################
# Deploy on raspberry pi
###################################

###################################
# Install nginx
###################################
sudo apt-get upgrade
sudo apt-get update
sudo apt-get install nginx -y

# start nginx
sudo /etc/init.d/nginx start

# configure nginx load balancing
# use file nginx.conf in the directory conf_server
# replace with the default nginx.conf in /etc/nginx

###################################
# Install mongo
# http://raspbian-france.fr/installer-mongodb-raspberry-pi/
###################################
sudo apt-get mongodb-server -y

# check status
/etc/init.d/mongodb status

###################################
# Install nodejs
# https://www.geeek.org/raspberry-pi-comment-installer-nodejs-051.html
###################################

wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb
# check install
node -v

###################################
# Get the project (currently the working project is on mongodb branch)
###################################
# go to the directory where you want to set up project
git clone https://github.com/othke/redis_server.git
git checkout -b mongodb origin/mongodb

# Go to the project directory and make npm install
npm install

###################################
# Lauch nodejs node instance
###################################
# Set the port corresponding to nginx load balancing
# This operation should be repeat as long as you need a new node with differents PORT (8081, 8082, 8083, etc...)
NODE_PORT=9000 node index.js &
NODE_PORT=9001 node index.js &
NODE_PORT=9002 node index.js &
NODE_PORT=9003 node index.js &



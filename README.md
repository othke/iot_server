# Deploy on raspberry pi

###################################
# Install nginx
###################################
sudo apt-get upgrade
sudo apt-get update
sudo apt-get install nginx -y

# start nginx
sudo /etc/init.d/nginx start

# configure nginx load balancing

###################################
# install mongo
# http://raspbian-france.fr/installer-mongodb-raspberry-pi/
###################################
sudo apt-get update
sudo apt-get mongodb-server

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

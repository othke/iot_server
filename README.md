###################################
# Deploy on raspberry pi
###################################

###################################
# Update
###################################
sudo apt-get upgrade
sudo apt-get update

###################################
# Install mongo
# http://raspbian-france.fr/installer-mongodb-raspberry-pi/
###################################
sudo apt-get mongodb-server -y

# check status
/etc/init.d/mongodb start
/etc/init.d/mongodb status

###################################
# Initialize mongo db
###################################
mongo
use hackathon
db.runCommand( { create: "messages"} );
db.messages.createIndex({ id: 1 }, {unique:true});
db.messages.dropIndex("_id_");

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
node cluster.js




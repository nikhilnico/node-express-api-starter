#!/bin/bash

# Update the system
echo 'Update the system'
sudo apt-get update && sudo apt-get -y upgrade
echo 'System updated'

# Installing Node
if [ ! -f /usr/bin/node ]; then
    echo 'Installing Node'
    # Adding the NodeSource APT repository for Debian-based distributions repository AND the PGP key for verifying packages
    curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

    # Install Node.js from the Debian-based distributions repository
    sudo apt-get install -y nodejs
    sudo apt-get install npm

else
    echo "NodeJs already installed.  Skipping..."
fi

if [ ! -f /usr/bin/mongod ]; then
    echo 'Installing MongoDB'
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
    echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
    sudo apt-get -y update
    sudo apt-get install -y mongodb-org
    # Start MongoDB
    sudo service mongod start
    # Create database
    mongo --eval 'use lalamove'
    mongo --eval 'db.createCollection("orders");'
else
  echo "mongo db already installed.  Skipping..."
fi

# Start the application
echo 'Starting application'
npm install
node server.js

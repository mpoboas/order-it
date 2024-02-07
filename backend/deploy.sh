#!/bin/bash

# Check if MongoDB URI is provided as an argument
if [ -z "$1" ]; then
  echo "Error: MongoDB URI not provided."
  exit 1
fi

# Update the code
git pull
echo "Git pull done"

# Install or update dependencies
npm install
echo "NPM install done"

# Set environment variables
export MONGODB_URI="$1"
export PORT=80

# Restart the application
npm run pm2:delete
npm run pm2:start
echo "PM2 restart done"

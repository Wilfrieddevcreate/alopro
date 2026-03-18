#!/bin/bash
set -e

echo ">> Pulling latest changes..."
cd ~/htdocs/alopro.net
git pull origin main

echo ">> Installing dependencies..."
npm install

echo ">> Building..."
npm run build

echo ">> Restarting app..."
pm2 restart alopro || pm2 start npm --name "alopro" -- run start

echo ">> Deploy complete!"

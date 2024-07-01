#!/bin/bash
# Exit on error
set -e
# Catch uninitialized variables
set -u
# Catch errors in pipelines
set -o pipefail
mkdir -p ./integration-test

echo "Copying files into the integration-test directory"
cp -fRp ./src \
 ./static \
 ./config \
 ./tests \
 ./package.json \
 ./tsconfig.json  \
 ./playwright.config.ts \
 ./vite.config.ts \
 ./tailwind.config.ts  \
 ./svelte.config.js \
 ./postcss.config.cjs \
 ./.npmrc \
 ./.env \
 ./.env.test ./integration-test

echo "Moving into the integration-test directory"
cd ./integration-test || exit

echo "Running prebuild and starting the docker containers"
docker-compose up

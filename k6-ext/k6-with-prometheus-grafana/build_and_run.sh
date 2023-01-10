#!/bin/bash

set -e

# build Docker image
cd app && ./build.sh && cd -
# run app, prometheus and grafana
docker-compose up -d
# wait for the app to be up
sleep 5
# run k6
docker run --rm -i --network="host" grafana/k6:0.42.0 run -o experimental-prometheus-rw - <script.js

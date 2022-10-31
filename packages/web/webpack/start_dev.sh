#!/usr/bin/env bash

# Note: script should be run from package root.

# Add ts-node and nodemon to PATH
export PATH=$PATH:./node_modules/.bin:../../node_modules/.bin

# Cleanup
rm -rf ./dist

echo "Building client/server bundles"
ts-node --swc webpack/build.ts --watch 2>&1 &
WEBPACK_PID=$!

# Wait until server file appears
until [ -f ./dist/main.js ]
do
     sleep 1
done

echo "Starting server bundle"
nodemon --watch dist/main.js -V --inspect=9202 dist/main.js 2>&1 &
SRV_PID=$!

# Some magic to shut down all services at once when requested

TRAPPED_SIGNAL=false
trap "TRAPPED_SIGNAL=true; kill -15 $WEBPACK_PID; kill -15 $SRV_PID" SIGTERM SIGINT

while :
do
    kill -0 $WEBPACK_PID 2> /dev/null
    WEBPACK_STATUS=$?

    kill -0 $SRV_PID 2> /dev/null
    SRV_STATUS=$?

    if [ "$TRAPPED_SIGNAL" = "false" ]; then
        if [ $WEBPACK_STATUS -ne 0 ] || [ $SRV_STATUS -ne 0 ]; then
            if [ $WEBPACK_STATUS -eq 0 ]; then
                kill -15 $WEBPACK_PID;
                wait $WEBPACK_PID;
            fi
            if [ $SRV_STATUS -eq 0 ]; then
                kill -15 $SRV_PID;
                wait $SRV_PID;
            fi
            exit 1;
        fi
    else
       if [ $WEBPACK_STATUS -ne 0 ] && [ $SRV_STATUS -ne 0 ]; then
            exit 0;
       fi
    fi

    sleep 1
done

#!/usr/bin/env bash

# Note: script should be run from repo root.

echo "Running local setup"
echo "------------------------------------------"
echo "Prerequisites: "
echo "* PostgreSQL DBMS should be up and running on port 5432"
echo "* You should have a gradejs-public database (username and password should be 'gradejs', dbname should be 'gradejs-public')"
echo "* Gradejs internal api must be started on port 8082"
echo "------------------------------------------"
echo "Note: nodejs debug server started, you can attach a client (e.g. chrome://inspect) to ports below"
echo "- Public api debugger on localhost:9201"
echo "- Worker debugger on localhost:9202"

# Save current env and values passed in CLI
CURENV=$(declare -p -x)
# Set local development env vars
set -o allexport
source cli/development.env
set +o allexport
# Overwrite development defaults with values passed in CLI
eval "$CURENV"

# Ensure we have all the packages
yarn

# Rebuild packages
yarn build:backend

echo "Starting elasticmq to mock amazon sqs"
docker run --rm --name frontendqueue -p 29324:9324 -p 29325:9325 \
  -v `pwd`/cli/local_sqs.conf:/opt/elasticmq.conf softwaremill/elasticmq-native 2>&1 &
ELASTICMQ_PID=$!

echo "Starting worker package"
AWS_REGION=test PORT=8084 DB_URL=postgres://gradejs:gradejs@localhost:5432/gradejs-public \
  SQS_WORKER_QUEUE_URL=/test/frontend-queue \
  SQS_ENDPOINT=http://localhost:29324 AWS_ACCESS_KEY_ID=secret AWS_SECRET_ACCESS_KEY=secret \
  INTERNAL_API_ROOT_URL=http://localhost:8082 \
  GRADEJS_API_KEY=TEST_API_KEY \
  npm run debug --prefix packages/worker 2>&1 &
WORKER_PID=$!

echo "Starting queue puller script"
AWS_REGION=test AWS_ACCESS_KEY_ID=secret AWS_SECRET_ACCESS_KEY=secret \
  SQS_ENDPOINT=http://localhost:29324 \
  WORKER_ROOT_URL=http://localhost:8084 \
  ./node_modules/.bin/ts-node --swc cli/localSqsPuller.ts 2>&1 &
PULLER_PID=$!

echo "Starting public api package"
AWS_REGION=test PORT=8083 DB_URL=postgres://gradejs:gradejs@localhost:5432/gradejs-public \
  SQS_WORKER_QUEUE_URL=/test/frontend-queue \
  SQS_ENDPOINT=http://localhost:29324 AWS_ACCESS_KEY_ID=secret AWS_SECRET_ACCESS_KEY=secret \
  CORS_ALLOWED_ORIGIN=http://localhost:3000 \
  INTERNAL_API_ROOT_URL=http://localhost:8082 \
  GRADEJS_API_KEY=TEST_API_KEY \
  npm run debug --prefix packages/public-api 2>&1 &
API_PID=$!

echo "Starting web package dev server"
PORT=3000 PUBLIC_ROOT_URL=http://localhost:3000 \
  API_ORIGIN=http://localhost:8083 \
  CORS_ORIGIN=http://localhost:3000 \
  PLAUSIBLE_DOMAIN= \
  GA_ID= \
  DUMP_ANALYTICS= \
  npm run dev:start --prefix packages/web 2>&1 &
WEB_PID=$!

# Some magic to shut down all services at once when requested

TRAPPED_SIGNAL=false
trap "TRAPPED_SIGNAL=true; kill -15 $ELASTICMQ_PID; kill -15 $WORKER_PID; kill -15 $PULLER_PID; kill -15 $API_PID; kill -15 $WEB_PID" SIGTERM SIGINT

while :
do
    kill -0 $ELASTICMQ_PID 2> /dev/null
    ELASTICMQ_STATUS=$?

    kill -0 $WORKER_PID 2> /dev/null
    WORKER_STATUS=$?

    kill -0 $PULLER_PID 2> /dev/null
    PULLER_STATUS=$?

    kill -0 $API_PID 2> /dev/null
    API_STATUS=$?

    kill -0 $WEB_PID 2> /dev/null
    WEB_STATUS=$?

    if [ "$TRAPPED_SIGNAL" = "false" ]; then
        if [ $ELASTICMQ_STATUS -ne 0 ] || [ $WORKER_STATUS -ne 0 ] || [ $PULLER_STATUS -ne 0 ] || [ $API_STATUS -ne 0 ] || [ $WEB_STATUS -ne 0 ]; then
            if [ $ELASTICMQ_STATUS -eq 0 ]; then
                kill -15 $ELASTICMQ_PID;
                wait $ELASTICMQ_PID;
            fi
            if [ $WORKER_STATUS -eq 0 ]; then
                kill -15 $WORKER_PID;
                wait $WORKER_PID;
            fi
            if [ $PULLER_STATUS -eq 0 ]; then
                kill -15 $PULLER_PID;
                wait $PULLER_PID;
            fi
            if [ $API_STATUS -eq 0 ]; then
                kill -15 $API_PID;
                wait $API_PID;
            fi
            if [ $WEB_STATUS -eq 0 ]; then
                kill -15 $WEB_PID;
                wait $WEB_PID;
            fi
            exit 1;
        fi
    else
       if [ $ELASTICMQ_STATUS -ne 0 ] && [ $WORKER_STATUS -ne 0 ] && [ $PULLER_STATUS -ne 0 ] && [ $API_STATUS -ne 0 ] && [ $WEB_STATUS -ne 0 ]; then
            exit 0;
       fi
    fi

    sleep 1
done

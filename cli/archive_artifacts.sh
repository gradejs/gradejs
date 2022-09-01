#!/bin/bash

# Strip dev packages
yarn install --production --pure-lockfile

# Tar is required to keep the symlinks inside node_modules alive
# and thus avoid running `yarn install --production` on server
tar cf build.tar \
    packages/public-api/build \
    packages/public-api/package.json \
    packages/public-api/node_modules \
    packages/worker/build \
    packages/worker/package.json \
    packages/worker/node_modules \
    packages/shared/build \
    packages/shared/package.json \
    packages/shared/node_modules \
    packages/web/dist \
    packages/web/package.json \
    packages/web/node_modules \
    node_modules \
    package.json \
    eb-start.sh

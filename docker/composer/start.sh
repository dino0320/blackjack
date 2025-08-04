#!/bin/bash

set -euxo pipefail

PROJECT_PATH=$1

cd $PROJECT_PATH

composer install

#set +x
# nvm is not loaded so load it.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
#set -x

npm ci
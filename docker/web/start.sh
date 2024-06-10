#!/bin/bash

set -euxo pipefail

PROJECT_PATH=$1

cd $PROJECT_PATH

php artisan migrate

# nvmが読み込まれていないため読み込む
set +x
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
set -x

npm ci

php-fpm
nginx -g "daemon off;"
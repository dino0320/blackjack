#!/bin/bash

set -euxo pipefail

PROJECT_PATH=$1

cd $PROJECT_PATH

composer install

php artisan env:decrypt --force --env=$APP_ENV

#echo test

#yum install bind-utils nmap-ncat -y
#nslookup blackjack-db.c94qwmk4wfbx.ap-northeast-1.rds.amazonaws.com
#nc -zv blackjack-db.c94qwmk4wfbx.ap-northeast-1.rds.amazonaws.com 3306

php artisan migrate:fresh --force --path=database/migrations/user --database=mysql
php artisan migrate:fresh --force --path=database/migrations/master --database=sqlite --seed

# nvm is not loaded so load it.
set +x
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
set -x

npm ci

# Give permissions for log output etc.
chmod 777 "$PROJECT_PATH/storage/logs"
chmod 777 "$PROJECT_PATH/storage/framework/views"

php-fpm
nginx -g "daemon off;"
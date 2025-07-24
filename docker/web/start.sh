#!/bin/bash

set -euxo pipefail

PROJECT_PATH=$1

cd $PROJECT_PATH

composer install

php artisan env:decrypt --force --env=$APP_ENV
cp .env.$APP_ENV .env

php artisan migrate:fresh --force --path=database/migrations/user --database=mysql
php artisan migrate:fresh --force --path=database/migrations/master --database=sqlite --seed

# Install Xdebug
if [ "$APP_ENV" = "local" ]; then
  pecl install xdebug-3.3.1
  cp docker/web/php/conf.d/99-xdebug.ini /etc/php.d/99-xdebug.ini
fi

set +x
# nvm is not loaded so load it.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
set -x

npm ci

if [ "$APP_ENV" = "production" ]; then
  npm run build
fi

# Give permissions for log output etc.
chmod 777 "$PROJECT_PATH/storage/logs"
chmod 777 "$PROJECT_PATH/storage/framework/views"

yum install bind-utils nmap-ncat -y
nslookup clustercfg.blackjack-redis.4t7rvc.apne1.cache.amazonaws.com
nc -zv clustercfg.blackjack-redis.4t7rvc.apne1.cache.amazonaws.com 6379

php-fpm
nginx -g "daemon off;"
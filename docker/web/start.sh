#!/bin/bash

set -euxo pipefail

PROJECT_PATH=$1

cd $PROJECT_PATH

# composer install and npm ci
if [ "$APP_ENV" = "local" ]; then
  composer install
  # nvm is not loaded so load it
  source ~/.bashrc
  npm ci

if [ $IS_NPM_BUILT -eq 1 ]; then
  npm run build
fi
fi

php artisan env:decrypt --force --env=$APP_ENV
cp .env.$APP_ENV .env

php artisan migrate:fresh --force --path=database/migrations/user --database=mysql
php artisan migrate:fresh --force --path=database/migrations/master --database=sqlite --seed

# Give permissions for log output etc.
#chown -R nginx:nginx "$PROJECT_PATH/storage" "$PROJECT_PATH/bootstrap/cache"
chmod -R 775 "$PROJECT_PATH/storage"
#chmod 775 "$PROJECT_PATH/storage/logs"
#chmod 775 "$PROJECT_PATH/storage/framework/views"

# Create a ready flag
touch /tmp/app-ready

# Start php-fpm and NGINX
# By using -g "daemon off;", NGINX runs in the foreground, preventing the container from exiting automatically
php-fpm
nginx -g "daemon off;"
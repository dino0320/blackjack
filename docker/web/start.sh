#!/bin/bash

set -euxo pipefail

PROJECT_PATH=$1

cd $PROJECT_PATH

php artisan migrate

php-fpm
nginx -g "daemon off;"
#!/bin/bash

cd /srv/blackjack

php artisan migrate

php-fpm
nginx -g "daemon off;"
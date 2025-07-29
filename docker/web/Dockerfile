FROM amazonlinux:2023

# Copy this project
COPY . /srv/blackjack

# NGINX
RUN yum -y install yum-utils
COPY docker/web/nginx/nginx.repo /etc/yum.repos.d/nginx.repo
RUN yum -y install nginx-1.24.0
COPY docker/web/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
RUN sed -i s/notice/warn/ /etc/nginx/nginx.conf
RUN ln -s /dev/stdout /var/log/nginx/access.log
RUN ln -s /dev/stderr /var/log/nginx/error.log

# php-fpm
RUN yum -y install php8.2-fpm php8.2-mysqlnd php8.2-mbstring
RUN mkdir /run/php-fpm
RUN mkdir /var/run/php
COPY docker/web/php/conf.d/zzz-php.ini /etc/php.d/zzz-php.ini
COPY docker/web/php/php-fpm.d/zzz-php-fpm.conf /etc/php-fpm.d/zzz-php-fpm.conf
COPY docker/web/php/php-fpm.d/zzz-www.conf /etc/php-fpm.d/zzz-www.conf
RUN sed -i "s/error_log/;error_log/" /etc/php-fpm.conf
RUN sed -i "s/php_admin_value\[error_log\]/;php_admin_value\[error_log\]/" /etc/php-fpm.d/www.conf

# Composer
RUN yum -y install php8.2-cli unzip-6.0
COPY docker/web/install-composer.sh /tmp/install-composer.sh
RUN chmod 755 /tmp/install-composer.sh
RUN /tmp/install-composer.sh /usr/local/bin/composer 2.7.6

# MySQL Client
RUN rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023
RUN yum -y install https://repo.mysql.com/mysql80-community-release-el9-1.noarch.rpm
RUN yum -y install mysql-community-client-8.0.34

# Valkey
RUN yum -y install php-pear-1:1.10.13 php8.2-devel
RUN pecl install redis-6.1.0
COPY docker/web/php/conf.d/50-valkey.ini /etc/php.d/50-valkey.ini

# Node.js
RUN touch ~/.bashrc
COPY docker/web/install-node.sh /tmp/install-node.sh
RUN chmod 755 /tmp/install-node.sh
RUN /tmp/install-node.sh 20.14.0

# SQLite
RUN yum -y install sqlite-3.40.0
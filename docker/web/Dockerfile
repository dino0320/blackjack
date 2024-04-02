FROM amazonlinux:2023

RUN yum -y install yum-utils
COPY nginx/nginx.repo /etc/yum.repos.d/nginx.repo
RUN yum -y install nginx-1.24.0
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

RUN yum -y install php8.2-fpm php8.2-mysqlnd
RUN mkdir /run/php-fpm
RUN mkdir /var/run/php
COPY php/php-fpm.d/zzz-www.conf /etc/php-fpm.d/zzz-www.conf

RUN yum -y install php-pear php-devel
RUN pecl install xdebug-3.3.1
COPY php/conf.d/99-xdebug.ini /etc/php.d/99-xdebug.ini

CMD bash -c 'php-fpm && nginx -g "daemon off;"'
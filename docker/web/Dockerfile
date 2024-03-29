FROM amazonlinux:2023

RUN yum -y install yum-utils
COPY nginx/nginx.repo /etc/yum.repos.d/nginx.repo
RUN yum -y install nginx-1.24.0

RUN yum -y install php8.2-fpm php8.2-mysqlnd
RUN mkdir /run/php-fpm
RUN mkdir /var/run/php
COPY php/www.conf /etc/php-fpm.d/www.conf

CMD bash -c '/usr/sbin/php-fpm && /usr/sbin/nginx -g "daemon off;"'
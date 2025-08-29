#!/bin/bash

set -exo pipefail

mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS \`test_database\`;
    GRANT ALL ON \`test_database\`.* TO '$MYSQL_USER'@'%';
EOSQL
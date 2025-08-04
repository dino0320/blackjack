#!/bin/bash

set -euxo pipefail

PROJECT_PATH=$1

aws s3 cp s3://blackjack-bucket-1000/.env $PROJECT_PATH

$PROJECT_PATH/docker/web/start.h $PROJECT_PATH
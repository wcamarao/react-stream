#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"

cd $DIR

P1="$(which docker-compose) up"
P2="cd $DIR/api && wait-on tcp:6379 && npm start"
P3="cd $DIR/stream && wait-on tcp:8080 && npm start"
P4="cd $DIR/web && wait-on tcp:8080 && npm start"

concurrently -c "magenta" \
             -n "redis,api,stream,web" \
             "$P1" "$P2" "$P3" "$P4"

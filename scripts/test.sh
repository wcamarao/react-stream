#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"

function print() {
  echo -e "\033[0;32m$1\033[0m"
}

cd $DIR/api
print "[api] Running tests"
npm test

cd $DIR/web
print "[web] Running tests"
npm test
